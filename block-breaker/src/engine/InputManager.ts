import type { InputState } from "../types/game";

export class InputManager {
  private inputState: InputState = {
    mouseX: 0,
    touchX: 0,
    keyLeft: false,
    keyRight: false,
    spacePressed: false,
    touchActive: false,
    inputMethod: "mouse",
  };

  private listeners: Array<() => void> = [];
  private element: HTMLElement | null = null;

  initialize(element: HTMLElement) {
    this.element = element;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.element) return;

    // Mouse events
    // this.element.addEventListener("mousemove", this.handleMouseMove);
    this.element.addEventListener("click", this.handleClick);

    // Keyboard events
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    // Touch events
    this.element.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.element.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.element.addEventListener("touchend", this.handleTouchEnd, { passive: false });
  }

  // Mouse moved removed as per request
  // private handleMouseMove = (e: MouseEvent) => {
  //   if (!this.element) return;
  //   const rect = this.element.getBoundingClientRect();
  //   this.inputState.mouseX = e.clientX - rect.left;
  //   this.inputState.inputMethod = 'mouse';
  //   this.notifyListeners();
  // };

  private handleClick = () => {
    this.inputState.spacePressed = true;
    this.inputState.inputMethod = "mouse";
    this.notifyListeners();
    setTimeout(() => {
      this.inputState.spacePressed = false;
    }, 100);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      this.inputState.keyLeft = true;
      this.inputState.inputMethod = "keyboard";
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      this.inputState.keyRight = true;
      this.inputState.inputMethod = "keyboard";
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.inputState.spacePressed = true;
      this.inputState.inputMethod = "keyboard";
    }
    this.notifyListeners();
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      this.inputState.keyLeft = false;
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      this.inputState.keyRight = false;
    }
    if (e.key === " " || e.key === "Enter") {
      this.inputState.spacePressed = false;
    }
    this.notifyListeners();
  };

  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    if (!this.element || e.touches.length === 0) return;

    const rect = this.element.getBoundingClientRect();
    this.inputState.touchX = e.touches[0].clientX - rect.left;
    this.inputState.touchActive = true;
    this.inputState.inputMethod = "touch";

    // Tap to launch
    this.inputState.spacePressed = true;
    setTimeout(() => {
      this.inputState.spacePressed = false;
    }, 100);

    this.notifyListeners();
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!this.element || e.touches.length === 0) return;

    const rect = this.element.getBoundingClientRect();
    this.inputState.touchX = e.touches[0].clientX - rect.left;
    this.inputState.inputMethod = "touch";
    this.notifyListeners();
  };

  private handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    this.inputState.touchActive = false;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState(): InputState {
    return { ...this.inputState };
  }

  cleanup() {
    if (!this.element) return;

    // this.element.removeEventListener("mousemove", this.handleMouseMove);
    this.element.removeEventListener("click", this.handleClick);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.element.removeEventListener("touchstart", this.handleTouchStart);
    this.element.removeEventListener("touchmove", this.handleTouchMove);
    this.element.removeEventListener("touchend", this.handleTouchEnd);

    this.listeners = [];
  }
}
