import React from 'react';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timer: 1500,
      breaktime: false,
      playing: false,
    };
  }

  convertTime = () => {
    let timeArr = [
      Math.floor(this.state.timer / 60).toString(),
      (this.state.timer % 60).toString(),
    ];
    let [minutes, seconds] = timeArr.map((time) =>
      time.length === 1 ? '0' + time : time
    );
    return `${minutes}:${seconds}`;
  };

  decrement = (type) => {
    type === 'session' && this.state.session > 1
      ? this.setState({
        session: this.state.session - 1,
      })
      : type === 'break' && this.state.break > 1
        ? this.setState({
          break: this.state.break - 1,
        })
        : null;
  };

  increment = (type) => {
    type === 'session' && this.state.session < 60
      ? this.setState({
        session: this.state.session + 1,
      })
      : type === 'break' && this.state.break < 60
        ? this.setState({
          break: this.state.break + 1,
        })
        : null;
  };

  playPause = () => {
    if (!this.state.playing) {
      this.setState({ playing: true });
      this.intervalId = setInterval(() => {
        this.setState((prevState) => ({
          timer: prevState.timer - 1,
        }));
        this.state.timer < 0 && !this.state.breaktime
          ? (this.playAudio(),
            this.setState({
              timer: this.state.break * 60,
              breaktime: true,
            }))
          : this.state.timer < 0 && this.state.breaktime
            ? (this.playAudio(),
              this.setState({
                timer: this.state.session * 60,
                breaktime: false,
              }))
            : null;
      }, 1000);
    } else {
      clearInterval(this.intervalId);
      this.setState({ playing: false });
    }
  };

  playAudio = () => {
    this.audio.currentTime = 0;
    this.audio.play();
  };

  reset = () => {
    clearInterval(this.intervalId);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      session: 25,
      break: 5,
      timer: 1500,
      breaktime: false,
      playing: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    prevState.session !== this.state.session
      ? this.setState({ timer: this.state.session * 60 })
      : null;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div>
        <div className={`flex-col items-center justify-center bg-white rounded-full shadow-2xl p-8 w-250 h-250 ${this.state.playing && 'pulse-circle'}`}>
          <h2 className="text-5xl font-bold text-center text-indigo-300 mb-8 drop-shadow-xl">
            POMODORO
          </h2>
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold" id="break-label">
                Break Length
              </h2>
              <div className="flex items-center justify-center mt-2">
                <button
                  className="btn-decrement"
                  id="break-decrement"
                  onClick={() => this.decrement('break')}
                  disabled={this.state.playing}
                >
                  -
                </button>
                <span className="text-4xl mx-4" id="break-length">
                  {this.state.break}
                </span>
                <button
                  className="btn-increment"
                  id="break-increment"
                  onClick={() => this.increment('break')}
                  disabled={this.state.playing}
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold" id="session-label">
                Session Length
              </h2>
              <div className="flex items-center justify-center mt-2">
                <button
                  className="btn-decrement"
                  id="session-decrement"
                  onClick={() => this.decrement('session')}
                  disabled={this.state.playing}
                >
                  -
                </button>
                <span className="text-4xl mx-4" id="session-length">
                  {this.state.session}
                </span>
                <button
                  className="btn-increment"
                  id="session-increment"
                  onClick={() => this.increment('session')}
                  disabled={this.state.playing}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-inner p-8 mb-6 text-center"
            id="screen"
          >
            <h3 className="text-2xl mb-2" id="timer-label">
              {this.state.breaktime ? 'Break!' : 'Session'}
            </h3>
            <h1 className="text-6xl font-bold" id="time-left">
              {this.convertTime(this.state.sesssec)}
            </h1>
            <audio
              id="beep"
              src="https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/Alarm%20Sounds/108[kb]crackle-alarm.wav.mp3"
              ref={(ref) => (this.audio = ref)}
            ></audio>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className={`${this.state.playing
                  ? 'btn-pause'
                  : 'btn-play'
                }`}
              id="start_stop"
              onClick={this.playPause}
            >
              {this.state.playing ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </button>
            <button
              className="btn-reset"
              id="reset"
              onClick={this.reset}
            >
              <i className="fa-solid fa-refresh"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
