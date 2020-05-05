import React, { useEffect } from 'react';
import './styles/App.scss';
import p5 from 'p5';
import Sketch from './components/Sketch';

const App: React.FC = () => {
  const sketchRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => { new p5(Sketch, sketchRef.current) }, [sketchRef]);

  return (
    <div className="App">
      <div ref={sketchRef}></div>
    </div>
  );
}

export default App;
