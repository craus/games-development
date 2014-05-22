exports.rnd = function(a,b) {
  if (!b) {
    b = a
    a = 0
  }
  return a + Math.floor(Math.random() * (b-a))
}
  
exports.rndEl = function(a) {
  return a[exports.rnd(a.length)]
}
