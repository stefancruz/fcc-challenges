function getForwardForClient(req) {

  if (!req) throw "Bad request";

  const forwardedForString = req.get('X-Forwarded-For');
  const forwardForArray = forwardedForString && forwardedForString.length ? forwardedForString.split(',') : [];
  return forwardForArray.length ? forwardForArray[0] : req.ip;

}

module.exports = {
  getForwardForClient
}