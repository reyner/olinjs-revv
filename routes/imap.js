var Imap = require('imap');

var imap = new Imap({
  user: process.env.GMAIL_LOGIN,
  password: process.env.GMAIL_PASS,
  host: 'imap.gmail.com',
  port: 993,
  secure: true
}), box;

function openInbox (next) {
  imap.connect(function (err) {
    if (err) {
      console.error('Error connecting', err);
      process.exit(1);
    }
    next();
  });
}

function selectBox (box, next) {
  imap.openBox(box, true, function (err) {
    if (err) {
      console.error('Error connecting', err);
    }
    next();
  })
}

function searchMail (keywords, next) {
  selectBox('[Gmail]/All Mail', function () {
    imap.search([
      //'ALL', ['SENTBEFORE', 'Dec 10, 2004'],
      // ['X-GM-LABELS', list],
      ['TEXT', keywords.join(' ')]
    ], function (err, results) {
      console.log(results.length);
      if (err) {
        next(null, []);
      } else {
        next(null, results);
      }
    });
  });
}

function retrieveMail (results, each) {
  var count = 0, done = false;
  if (!results.length) {
    return each(null, null);
  }
  selectBox('[Gmail]/All Mail', function () {
    imap.fetch(results, { struct: false },
      { headers: { parse: false },
        body: true,
        cb: function (fetch) {
          fetch.on('message', function (msg) {
            //console.log('Checking message no. ' + msg.seqno);
            count++;

            var parser = new mailparser.MailParser();
            parser.on("end", function (obj) {
              text = obj.text;
              if (obj.alternatives && obj.alternatives.length) {
                obj.alternatives.forEach(function (alt) {
                  if (alt.contentType == 'text/plain') {
                    text = alt.content + text;
                  }
                });
              }

              var message = {
                seqno: msg.seqno,
                uid: msg.uid,
                subject: obj.subject,
                from: obj.from,
                to: obj.to,
                html: obj.html,
                text: text || (body && body.indexOf('_000_') > -1 ? '' : body),
                date: new Date(obj.headers.date)
              };

              each(null, message);

              count--;
              if (count <= 0 && done) {
                console.log('Done fetching all messages!');
                each(null, null);
              }
            });

            // Damn, old old messages have the wrong mime type entirely.
            // We patch this in our implementation.
            var body = null;
            msg.on('data', function (data) {
              if (body != null) {
                body += String(data);
              }
              if (body == null && String(data).match(/\r\n\r\n/)) {
                body = String(data).replace(/^[\s\S]*?\r\n\r\n/, '');
              }
            });

            // Forward data to mailparser.
            msg.on('data', function (data) {
              parser.write(data.toString());
            })
            msg.on('end', function (data) {
              parser.end();
            })
          });

          fetch.on('error', function (msg) {
            console.log(msg);
          })
        }
      }, function (err) {
        done = true;
        if (err) {
          each(null, null);
        };
        if (count == 0) {
          console.log('Done fetching some messages...');
          each(null, null);
        }
      }
    );
  });
}

function mailStream (ids, stream) {
  var first = true;
  stream.write('{"messages":[');
  retrieveMail(ids, function (err, message) {
    if (!message) {
      stream.end(']}');
      console.log('Done streaming mail.');
      return;
    }
    if (!first) {
      stream.write(',');
    }
    first = false;
    stream.write(JSON.stringify(message));
  });
}

exports.search = function (req, res) {
  searchMail((req.query.text || '').split(/\s+/), function (err, ids) {
    var chunkSize = 50;
    var groups = [].concat.apply([],
      ids.map(function (elem, i) {
        return i % chunkSize ? [] : [ids.slice(i, i + chunkSize)];
      })
    ).map(function (arr) {
      return {
        ids: arr.map(Number),
        url: 'http://' + app.get('host') + '/api/messages?ids=' + arr.join(',') + '&sessionid=' + req.session.sessionid
      };
    });
    res.json({groups: groups});
  })
};

exports.messages = function (req, res) {
  var ids = req.query.ids ? req.query.ids.split(',') : [];
  mailStream(ids, res);
};