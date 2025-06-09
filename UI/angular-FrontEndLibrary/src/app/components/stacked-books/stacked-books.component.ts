import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import gsap from 'gsap';
import booksTemplate from '../../books.json';
@Component({
  selector: 'app-stacked-books',
  standalone: true,
  imports: [],
  templateUrl: './stacked-books.component.html',
  styleUrls: ['./stacked-books.component.css'],
})
export class StackedBooksComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private animationId!: number;
  private books: THREE.Mesh[] = [];
  private INTERSECTED: THREE.Object3D | null = null;
  private clickableIndices = [2, 7];

  ngOnInit() {
    this.initScene();
    this.animate();
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('click', this.onClick, false);
    window.addEventListener('resize', this.onResize, false); // Add this
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('click', this.onClick, false);
    window.removeEventListener('resize', this.onResize, false); // Add this
  }

  private onResize = () => {

    // Optionally update renderer/camera size here too if needed
  };

  private initScene() {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = 129;

    const aspect = width / height;
    const viewHeight = height / 10; // 9.8 units tall
    const viewCenterY = viewHeight / 2;

    this.scene = new THREE.Scene();

    // === Step 1: Setup PerspectiveCamera ===
    const fov = 2; // Degrees — moderate FOV to match ortho scale
    const near = 0.1;
    const far = 1000;

    // Calculate camera distance to maintain same visible height
    const cameraDistance =
      viewHeight / 2 / Math.tan(((fov / 2) * Math.PI) / 180);

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, viewCenterY, cameraDistance); // centered horizontally
    this.camera.lookAt(0, viewCenterY, 0);

    // === Step 2: Renderer ===
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.renderer.setSize(width, height);

    // === Step 3: Lighting ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

    this.scene.add(light, ambientLight);

    // === Step 4: Create Books ===
    this.createBooks();
  }
  createSpineTextureWithOverlay(
    baseColor: string | number,
    svgUrl: string,
  ): Promise<THREE.Texture> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Fill background with baseColor
      ctx.fillStyle =
        typeof baseColor === 'number'
          ? `#${baseColor.toString(16).padStart(6, '0')}`
          : baseColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load SVG as image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        resolve(texture);
      };
      img.src = svgUrl;
    });
  }

  private async createBooks() {
    // Remove all previous books from the scene
    this.books.forEach((book) => this.scene.remove(book));
    this.books = [];

    const shelfWidth = this.canvasRef.nativeElement.clientWidth;
    const spacing = 3 + 0.3; // Use your base spacing

    const aspect = shelfWidth / 129;
    const visibleWorldWidth = aspect * (129 / 10);

    // Use as many books as fit, but not more than the template
    let numBooks = Math.floor(visibleWorldWidth / spacing);
    numBooks = Math.min(numBooks, booksTemplate.length);

    const totalWidthWithMargins = spacing * numBooks;
    if (totalWidthWithMargins > visibleWorldWidth - spacing / 2) {
      numBooks = Math.max(0, numBooks - 1);
    }

    const totalWidth = spacing * numBooks;
    const startX = -totalWidth / 2 + spacing / 2;

    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < numBooks; i++) {
      const template = booksTemplate[i];
      const isClickable = template.isClickable;

      // Load textures if specified in the template
      const leftMaterial = template.leftImg
        ? new THREE.MeshStandardMaterial({
            map: textureLoader.load(template.leftImg),
          })
        : new THREE.MeshStandardMaterial({
            color: template.leftColor || (isClickable ? 0xff4444 : 0x334477),
          });

      const rightMaterial = template.rightImg
        ? new THREE.MeshStandardMaterial({
            map: textureLoader.load(template.rightImg),
          })
        : new THREE.MeshStandardMaterial({
            color: template.rightColor || (isClickable ? 0xff4444 : 0x334477),
          });

      let frontMaterial: THREE.MeshStandardMaterial | undefined;
      if (template.spineImage) {
        frontMaterial = new THREE.MeshStandardMaterial({
          map: textureLoader.load(template.spineImage),
        });
      } else {
        // Assign SVG based on index
        const spineSVGs = {
          spinebold: [4, 9, 14, 19, 26, 48, 35, 50, 40, 10, 20],
          spinedark: [1, 6, 12, 18, 23, 29, 33, 37, 42, 45, 49, 47],
          spineclean: [0, 5, 11, 17, 22, 25, 28, 34, 38, 43, 46, 51],
          spinelight: [3, 8, 13, 16, 24, 27, 30, 31, 36, 39, 44],
        };

        let svgPath = '';
        if (spineSVGs.spinebold.includes(i)) {
          svgPath = 'assets/images/webpage-images/books/sVectors/spinebold.svg';
        } else if (spineSVGs.spinedark.includes(i)) {
          svgPath = 'assets/images/webpage-images/books/sVectors/spinedark.svg';
        } else if (spineSVGs.spineclean.includes(i)) {
          svgPath = 'assets/images/webpage-images/books/sVectors/spineclean.svg';
        } else if (spineSVGs.spinelight.includes(i)) {
          svgPath = 'assets/images/webpage-images/books/sVectors/spinelight.svg';
        }

        if (svgPath) {
          const baseColor =
            template.spineColor || (isClickable ? '#ff4444' : '#334477');

          await this.createSpineTextureWithOverlay(baseColor, svgPath).then(
            (texture) => {
              frontMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
              });
            },
          );
        } else {
          frontMaterial = new THREE.MeshStandardMaterial({
            color: template.spineColor || (isClickable ? 0xff4444 : 0x334477),
          });
        }
      }

      // Only proceed if frontMaterial is defined
      if (frontMaterial) {
        const materials: THREE.Material[] = [
          rightMaterial, // right
          leftMaterial, // left
          new THREE.MeshStandardMaterial({ color: 0xffffff }), // top
          new THREE.MeshStandardMaterial({ color: 0xdddddd }), // bottom
          frontMaterial, // front (spine)
          new THREE.MeshStandardMaterial({ color: 0x111111 }), // back
        ];

        const geometry = new THREE.BoxGeometry(
          template.width,
          template.height,
          template.depth,
        );
        geometry.translate(0, template.height / 2, 0);

        const book = new THREE.Mesh(geometry, materials);

        const x = startX + (numBooks - 1 - i) * spacing;
        const y = 0;
        const z = 0;

        book.position.set(x, y, z);
        book.castShadow = true;
        book.receiveShadow = true;

        book.userData = {
          index: i,
          isClickable: isClickable,
          originalPosition: book.position.clone(),
        };

        this.scene.add(book);
        this.books.push(book);
      }
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    const bounds = this.renderer.domElement.getBoundingClientRect();

    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    this.mouse.set(x, y);
  };

  private onClick = () => {
    if (this.INTERSECTED && this.INTERSECTED.userData['isClickable']) {
      const index = this.INTERSECTED.userData['index'];
      if (index === this.clickableIndices[0]) {
        this.router.navigate(['/home']);
      } else if (index === this.clickableIndices[1]) {
        this.router.navigate(['/library']);
      } else {
        alert(`Book ${index} clicked!`);
      }
    }
  };

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.books);

    if (intersects.length > 0) {
      const target = intersects[0].object;

      if (this.INTERSECTED !== target) {
        // Reset previous hovered book
        if (this.INTERSECTED) {
          const pos = this.INTERSECTED.userData['originalPosition'];
          gsap.to(this.INTERSECTED.position, {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            duration: 0.3,
          });
          gsap.to(this.INTERSECTED.rotation, { x: 0, duration: 0.3 }); // reset rotation
        }

        this.INTERSECTED = target;

        if (this.INTERSECTED.userData['isClickable']) {
          // Pull out, lift a bit, and tilt for hover effect
          gsap.to(this.INTERSECTED.position, {
            z: 2,
            y: this.INTERSECTED.position.y - 0.1,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(this.INTERSECTED.rotation, {
            x: -Math.PI / -10,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    } else {
      // No intersection: reset previously hovered book
      if (this.INTERSECTED) {
        const pos = this.INTERSECTED.userData['originalPosition'];
        gsap.to(this.INTERSECTED.position, {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          duration: 0.3,
        });
        gsap.to(this.INTERSECTED.rotation, { x: 0, duration: 0.3 });
        this.INTERSECTED = null;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

}
