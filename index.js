var lu = require('levelup'),
  mode = process.argv[2],
  dbname = 'test.db',
  recordcount = 1e6,
  chosenordinal,
  chosenrecord = [],
  chooseended,
  jobcount = 0;


if (mode == 1) {
  return write();
}

if (mode == 2) {
  return choose();
}

if (!( mode == 1 || mode == 2)) {
  console.log('Usage:');
  console.log(' node index.js 1, for creating 1e6 records');
  console.log(' node index.js 2, for choosing one record and saving it to a global variable');
  return;
}

function write () {
  var db = lu(dbname);
  writeone(db, 0);
}

function writeone (db, ordinal) {
  ordinal++;
  if (ordinal > recordcount) {
    console.log(recordcount, 'records written');
    db.close();
    db = null;
    return wait();
  }
  db.put(ordinal, {
    ordinal: ordinal,
    random: Math.random()
  }, writeone.bind(null, db, ordinal));
  db = null;
}

function choose () {
  var db = lu(dbname),
    stream = db.createReadStream();
  chosenordinal = 1+Math.floor(Math.random()*recordcount);
  stream.on('data', onRecord);
  stream.on('end', function () {
    stream.removeAllListeners();
    stream.destroy();
    stream = null;
    db.close();
    db = null;
    endChoose();
  });
}

function onRecord (record) {
  jobcount++;
  if (record.value.ordinal === chosenordinal) {
    console.log('Record', record, 'chosen and saved to a global var');
    chosenrecord.push(record);
  }
  record = null;
}


function endChoose () {
  if (!chooseended) {
    chooseended = true;
    wait();
  }
  console.log(process.pid, jobcount, 'records processed');
  setTimeout(choose, 5000);
}

function wait() {
  console.log('Job done, now analyze me', process.pid);
  process.stdin.resume();
}

