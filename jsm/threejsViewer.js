import * as THREE from "../threejs/build/three.module.js";
import { MarchingCubes } from '../threejs/examples/jsm/objects/MarchingCubes.js'
import { OrbitControls } from '../threejs/examples/jsm/controls/OrbitControls.js'

class threejsViewer {
    constructor(domElement) {
        this.size = 0
        this.databuffer = null
        this.textureOption = 0
        this.threshold = 75
        this.enableLine = false

        let width = domElement.clientWidth;
        let height = domElement.clientHeight;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xE6E6FA, 1.0)
        domElement.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        let aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50);
        this.camera.position.set(2, 1, 2)
        this.scene.add(this.camera)

        // Light
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(2, 1, 2)
        this.scene.add(directionalLight)

        // Controller
        let controller = new OrbitControls(this.camera, this.renderer.domElement)
        controller.target.set(0, 0.5, 0)
        controller.update()

        //Axis Landmark
        const axesHelper = new THREE.AxesHelper(100)
        this.scene.add(axesHelper)

        // Ground
        const plane = new THREE.Mesh(
            new THREE.CircleGeometry(2, 30),
            new THREE.MeshPhongMaterial({ color: 0xbbddff, opacity: 0.4, transparent: true })
        );
        plane.rotation.x = - Math.PI / 2;
        this.scene.add(plane);

        let scope = this
        this.renderScene = function () {
            requestAnimationFrame(scope.renderScene)
            scope.renderer.render(scope.scene, scope.camera);
        }

        //視窗變動時 ，更新畫布大小以及相機(投影矩陣)繪製的比例
        window.addEventListener('resize', () => {
            //update render canvas size
            let width = domElement.clientWidth
            let height = domElement.clientHeight
            this.renderer.setSize(width, height);

            //update camera project aspect
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix();
        })
        this.mesh = null;
        /*助教上課講的版本
        this.loadData = (paddingData, size, isovalue) => {
        */

        // 助教在Line群組上傳圖片的版本
        this.loadData = () => {
            this.mesh = new MarchingCubes(this.size);
            this.mesh.material = new THREE.MeshPhongMaterial();
            this.mesh.isolation = this.threshold;
            this.mesh.field = this.databuffer;

            /* 助教上課講的版本
            mesh = new MarchingCubes(size);
            mesh.material = new THREE.MeshPhongMaterial();
            mesh.isolation = isovalue;
            mesh.field = paddingData;
            */

            this.mesh.position.set(0, 1, 0);
            this.scene.add(this.mesh);
        }

        this.updateModel = () => {
            //geometry + material => mesh
            let mesh1 = this.scene.getObjectByName('mesh');

            if (mesh1 === undefined || mesh1 == null) {
                //初始化
                let mesh1 = new MarchingCubes(this.size);
                mesh1.name = 'mesh';
                mesh1.material = new THREE.MeshPhongMaterial();
                /* switch (this.textureOption) {
                    case 0:
                        this.mesh.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
                        break;
                    case 1:
                        this.mesh.material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
                        break;
                    case 2:
                        this.mesh.material = new THREE.MeshToonMaterial({ color: 0xff00ff });
                        break;
                    case 3:
                        this.mesh.material = new THREE.MeshNormalMaterial({ color: 0xff00ff });
                        break;
                } */

                mesh1.isolation = this.threshold;
                mesh1.field = this.databuffer;
                // add
                mesh1.position.set(0, 1, 0);

                this.scene.add(mesh1);
                // return this.mesh;
            }
            else {
                mesh1.isolation = this.threshold;
                mesh1.field = this.databuffer;

                mesh1.position.set(0, 1, 0);
            }
            this.mesh = mesh1;
        }

        this.download = () => {
            let geometry1 = this.mesh.generateGeometry();

            let mesh2 = new THREE.Mesh(geometry1);
            return mesh2;
        }

        this.renderScene()
    }
}

export {
    threejsViewer
}
