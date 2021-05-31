export class Point {
	constructor(private _x: number, private _y: number) {
	}

	get x(): number {
		return this._x;
	}

	get y(): number{
		return this._y;
	}
}

export class BoundingBox {
	private multiplierW: number;
	private multiplierH: number;
	constructor(
				private _center: Point,
				private _width: number,
				private _height: number,
				private _angle: number,
				private _multiplierH?: number,
				private _multiplierW?: number
	) {
		this.multiplierW = this._multiplierW? this._multiplierW : 1;
		this.multiplierH = this._multiplierH? this._multiplierH : 1;
	}

	get center(): Point{
		return new Point(this._center.x *this.multiplierH, this._center.y * this.multiplierW);
	}

	get width(): number {
		return this._width * this.multiplierH;
	}
	get height(): number {
		return this._height * this.multiplierW;
	}
	get angle(): number{
		return this._angle;
	}

	get boxPoints(): Point[]{

		const angle = this._angle * Math.PI / 180.0;
		const cosB = Math.cos(angle) * 0.5;
		const cosA = Math.sin(angle) * 0.5;

		const pt0 = new Point(
			this.center.x - cosA * this.height - cosB * this.width,
			this.center.y + cosB * this.height - cosA * this.width
		);

		const pt1 = new Point(
			this.center.x + cosA * this.height - cosB * this.width,
			this.center.y - cosB * this.height - cosA * this.width
		);

		const pt2 = new Point(2 * this.center.x - pt0.x, 2 * this.center.y - pt0.y);

		const pt3 = new Point(2 * this.center.x - pt1.x, 2 * this.center.y - pt1.y);

		return [pt0, pt1, pt2, pt3];
	}


	drawRotatedBoxes(boxes: Point[], canvas: HTMLCanvasElement, color?: string): void {
		const context = canvas.getContext('2d');
		if(color) context!.fillStyle = color;
		boxes.forEach( (box: Point, index) => {
			if(index===0){
				context!.moveTo(box.x, box.y);
			}

			context!.lineTo(box.x, box.y);
			if(index === boxes.length-1){
				context!.lineTo(boxes[0].x, boxes[0].y);
			}
			context!.stroke();

		});
	}
}


