module.exports = function(λ1, φ1, λ2, φ2) {

  λ1 *= Math.PI/180;
  λ2 *= Math.PI/180;
  φ1 *= Math.PI/180;
  φ2 *= Math.PI/180;

  // λ is the longitude, φ is the latitude

  var R = 6371; //Earth mean radius

  // θ is the angle between the two points located by (λ1, φ1), (λ2, φ2)

  cosθ = Math.cos(λ1)*Math.cos(λ2)*Math.cos(φ1)*Math.cos(φ2) +
  Math.sin(λ1)*Math.sin(λ2)*Math.cos(φ1)*Math.cos(φ2) +
  Math.sin(φ1)*Math.sin(φ2);

  θ = Math.acos(cosθ);

  return R*θ;

}
