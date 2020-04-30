import P5 from "p5"

const Sketch = (p5: P5) => {
    p5.setup = () => {
        p5.createCanvas(400, 400);
		p5.background("black");
    }

    p5.draw = () => {
        p5.fill("white");
        p5.circle(50, 50, 100);
    }
}

export default Sketch