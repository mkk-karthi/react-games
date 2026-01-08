import type { Vector2D, CollisionResult } from '../types/game';

export class CollisionDetector {
  // Check collision between circle (ball) and rectangle (paddle/block)
  static checkCircleRect(
    circlePos: Vector2D,
    radius: number,
    rectPos: Vector2D,
    rectWidth: number,
    rectHeight: number
  ): CollisionResult {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rectPos.x, Math.min(circlePos.x, rectPos.x + rectWidth));
    const closestY = Math.max(rectPos.y, Math.min(circlePos.y, rectPos.y + rectHeight));

    // Calculate distance between circle center and closest point
    const distanceX = circlePos.x - closestX;
    const distanceY = circlePos.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    if (distanceSquared < radius * radius) {
      const distance = Math.sqrt(distanceSquared);
      const penetration = radius - distance;

      // Calculate collision normal
      let normalX = distanceX;
      let normalY = distanceY;
      
      if (distance > 0) {
        normalX /= distance;
        normalY /= distance;
      } else {
        // Circle center is inside rectangle, use position-based normal
        const centerX = rectPos.x + rectWidth / 2;
        const centerY = rectPos.y + rectHeight / 2;
        normalX = circlePos.x - centerX;
        normalY = circlePos.y - centerY;
        const len = Math.sqrt(normalX * normalX + normalY * normalY);
        if (len > 0) {
          normalX /= len;
          normalY /= len;
        }
      }

      return {
        collided: true,
        normal: { x: normalX, y: normalY },
        penetration,
      };
    }

    return { collided: false };
  }

  // Calculate bounce angle based on where ball hits paddle
  static calculatePaddleBounceAngle(
    ballX: number,
    paddleX: number,
    paddleWidth: number
  ): number {
    // Normalize hit position (-1 to 1, where 0 is center)
    const relativeIntersectX = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
    
    // Max bounce angle (in radians) - 60 degrees
    const maxBounceAngle = Math.PI / 3;
    
    // Calculate bounce angle
    return relativeIntersectX * maxBounceAngle;
  }

  // Reflect velocity vector based on normal
  static reflect(velocity: Vector2D, normal: Vector2D): Vector2D {
    const dot = velocity.x * normal.x + velocity.y * normal.y;
    return {
      x: velocity.x - 2 * dot * normal.x,
      y: velocity.y - 2 * dot * normal.y,
    };
  }

  // Normalize vector
  static normalize(vector: Vector2D): Vector2D {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return {
      x: vector.x / length,
      y: vector.y / length,
    };
  }

  // Get vector length
  static length(vector: Vector2D): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }
}
