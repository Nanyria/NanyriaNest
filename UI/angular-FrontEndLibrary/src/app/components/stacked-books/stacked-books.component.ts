import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-stacked-books',
  standalone: true,
    imports: [],
  templateUrl: './stacked-books.component.html',
  styleUrls: ['./stacked-books.component.css']
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
  private clickableIndices = [2, 5];

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
    this.updateBooksForWidth();
    // Optionally update renderer/camera size here too if needed
  };

  private initScene() {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = 98;

    const aspect = width / height;
    const viewHeight = height / 10; // 9.8 units tall
    const viewCenterY = viewHeight / 2;

    this.scene = new THREE.Scene();

    // === Step 1: Setup PerspectiveCamera ===
    const fov = 2; // Degrees — moderate FOV to match ortho scale
    const near = 0.1;
    const far = 1000;

    // Calculate camera distance to maintain same visible height
    const cameraDistance = (viewHeight / 2) / Math.tan((fov / 2) * Math.PI / 180);

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, viewCenterY, cameraDistance); // centered horizontally
    this.camera.lookAt(0, viewCenterY, 0);

    // === Step 2: Renderer ===
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, alpha: true });
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

  private createBooks() {
    const width = 2, height = 8.5, depth = 5;
    const shelfWidth = this.canvasRef.nativeElement.clientWidth;

    const spacing = width + 0.3;

    // Estimate how many books fit:
    const aspect = shelfWidth / 98;
    const visibleWorldWidth = aspect * (98 / 10);

    let numBooks = Math.floor(visibleWorldWidth / spacing);

    // Check if there is enough room for spacing on both sides
    const totalWidthWithMargins = spacing * numBooks;
    if (totalWidthWithMargins > visibleWorldWidth - spacing) {
      numBooks = Math.max(0, numBooks - 1);
    }

    const totalWidth = spacing * numBooks;
    const startX = -totalWidth / 2 + spacing / 2;

    for (let i = 0; i < numBooks; i++) {
      const isClickable = this.clickableIndices.includes(i);

      // Add slight random variation to width and height
      let bookWidth = width + (Math.random() - 0.5) * 0.4;   // ±0.2 units
      let bookHeight = height + (Math.random() - 0.5) * 0.6; // ±0.3 units

      // Make clickable books a bit larger
      if (isClickable) {
        bookWidth += 0.5;   // or any value you like
        bookHeight += 0.7;  // or any value you like
      }

      // Calculate the left and right edge of this book
      const leftEdge = startX + i * spacing - bookWidth / 2;
      const rightEdge = startX + i * spacing + bookWidth / 2;
      if (leftEdge < -visibleWorldWidth / 2 || rightEdge > visibleWorldWidth / 2) {
        continue;
      }

      const materials = [
        new THREE.MeshStandardMaterial({ color: isClickable ? 0xff4444 : 0x334477 }),
        new THREE.MeshStandardMaterial({ color: isClickable ? 0xff4444 : 0x334477 }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xdddddd }),
        new THREE.MeshStandardMaterial({ color: isClickable ? 0xff4444 : 0x334477 }),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      ];

      const geometry = new THREE.BoxGeometry(bookWidth, bookHeight, depth);
      geometry.translate(0, bookHeight / 2, 0);

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
        originalPosition: book.position.clone()
      };

      this.scene.add(book);
      this.books.push(book);
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
          gsap.to(this.INTERSECTED.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.3 });
          gsap.to(this.INTERSECTED.rotation, { x: 0, duration: 0.3 }); // reset rotation
        }

        this.INTERSECTED = target;

        if (this.INTERSECTED.userData['isClickable']) {
          // Pull out, lift a bit, and tilt for hover effect
          gsap.to(this.INTERSECTED.position, {
            z: 2,
            y: this.INTERSECTED.position.y - 0.1,
            duration: 0.3,
            ease: 'power2.out'
          });
          gsap.to(this.INTERSECTED.rotation, {
            x: -Math.PI / -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    } else {
      // No intersection: reset previously hovered book
      if (this.INTERSECTED) {
        const pos = this.INTERSECTED.userData['originalPosition'];
        gsap.to(this.INTERSECTED.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.3 });
        gsap.to(this.INTERSECTED.rotation, { x: 0, duration: 0.3 });
        this.INTERSECTED = null;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updateBooksForWidth() {
    const width = 2, height = 8.5, depth = 5;
    const shelfWidth = this.canvasRef.nativeElement.clientWidth;
    const spacing = width + 0.3;

    const aspect = shelfWidth / 98;
    const visibleWorldWidth = aspect * (98 / 10);

    let numBooks = Math.floor(visibleWorldWidth / spacing);
    const totalWidthWithMargins = spacing * numBooks;
    if (totalWidthWithMargins > visibleWorldWidth - spacing) {
      numBooks = Math.max(0, numBooks - 1);
    }

    // Remove books from the end if there are too many
    while (this.books.length > numBooks) {
      const book = this.books.pop();
      if (book) this.scene.remove(book);
    }

    // Optionally add new books if there is room (not required if you only want to remove)
    // while (this.books.length < numBooks) {
    //   // Add new book creation logic here, similar to your createBooks() method
    // }

    // Optionally reposition all books if needed
    const totalWidth = spacing * numBooks;
    const startX = -totalWidth / 2 + spacing / 2;
    for (let i = 0; i < this.books.length; i++) {
      const x = startX + (numBooks - 1 - i) * spacing;
      this.books[i].position.set(x, 0, 0);
      this.books[i].userData['index'] = i;
      this.books[i].userData['originalPosition'] = this.books[i].position.clone();
        }
  }
}
