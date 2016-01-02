var container;
var camera, scene, renderer;

function hemisphereLight() {
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
  hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
  hemiLight.position.set( 0, 500, 0 );

  return hemiLight;
}

// main functions
init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.getElementById('threeRenderer').appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 70;
  camera.position.y = 30;
  camera.position.x = 60;

  // scene
  scene = new THREE.Scene();
  
  // add lights
  scene.add( hemisphereLight() );
  
  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.position.set( -1, 8000.75, 10000 );
  scene.add( dirLight );
  
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( -1, -1, -100 );
  scene.add( light );

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) {
    alert("sorry failed to load");
  };

  //obj and mtl loader
  var loader = new THREE.OBJMTLLoader();
  loader.load( 'obj/boots_color_triangles.obj', 'obj/boots_color_triangles.mtl', function ( object ) {
    object.position.y = -15;
    scene.add( object );
  }, onProgress, onError );

  // defaults to canvas if no webgl (maybe do better fallback)
  renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
  container.appendChild( renderer.domElement );

    //controls
  controls = new THREE.TrackballControls( camera, renderer.domElement );

  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 4.0;
  controls.panSpeed = 0.4;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.addEventListener( 'change', render );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);

  controls.handleResize();
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  renderer.render( scene, camera );
}