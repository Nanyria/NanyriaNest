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
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('click', this.onClick, false);
  }

  private initScene() {
    
    const width = 140;
    const height = 92.7;

    // Calculate scene units to match 1 unit = 10px
    const aspect = width / height;
    const viewHeight = height / 10; // 15 units tall
    const viewWidth = width / 10;   // 14 units wide

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      -viewWidth / 2, viewWidth / 2,
      viewHeight / 2, -viewHeight / 2,
      0.1, 1000
    );
    this.camera.position.set(0, viewHeight / 2, 20);
    this.camera.lookAt(0, viewHeight / 2, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.renderer.setSize(width, height);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

    this.createBooks();
  }

  private createBooks() {
    const width = 2, height = 8, depth = 0.5;
    const geometry = new THREE.BoxGeometry(width, height, depth);
    for (let i = 0; i < 10; i++) {
      const color = this.clickableIndices.includes(i) ? 0xff4444 : 0x8888ff;
      const material = new THREE.MeshStandardMaterial({ color });
      const book = new THREE.Mesh(geometry, material);
      book.position.set(i * (width + 0.2) - 5, height / 2, 0);
      book.userData = {
        index: i,
        isClickable: this.clickableIndices.includes(i),
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
        // Reset previous
        if (this.INTERSECTED) {
          const pos = this.INTERSECTED.userData['originalPosition'];
          gsap.to(this.INTERSECTED.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.3 });
        }

        this.INTERSECTED = target;
        if (this.INTERSECTED.userData['isClickable']) {
          // Pull out and slightly down
          gsap.to(this.INTERSECTED.position, {
            z: 1.5,
            y: this.INTERSECTED.position.y - 0.3,
            duration: 0.3
          });
        }
      }
    } else {
      if (this.INTERSECTED) {
        const pos = this.INTERSECTED.userData['originalPosition'];
        gsap.to(this.INTERSECTED.position, { x: pos.x, y: pos.y, z: pos.z, duration: 0.3 });
        this.INTERSECTED = null;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };
}
