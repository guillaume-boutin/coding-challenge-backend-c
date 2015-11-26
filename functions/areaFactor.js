var canadaArea = 9985000;
var usaArea = 9857000;
var totalArea = canadaArea + usaArea;
var R = 6371; //Earth mean radius

module.exports = function(s) {

  a = 1 - 2*Math.PI*Math.pow(R,2)*(1 - Math.cos(s/R)) / totalArea;

  if (a < 0) {
    a = 0;
  }

  return a;

}
