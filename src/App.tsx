import p5 from 'p5';
import React, { useEffect } from 'react';
import Sketch from './components/Sketch';
import './styles/App.scss';

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
