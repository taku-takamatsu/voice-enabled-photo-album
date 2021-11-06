import React, { useState } from 'react';
import Amplify, { Storage, Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from '../aws-exports';
import mic from 'microphone-stream';
import { IconButton } from '@mui/material';
import MicIcon from '@material-ui/icons/Mic';
import Search from './Search';


Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

export default function Transcribe(props) {
    const [response, setResponse] = useState("Search for photos using text/audio")
  
    function AudioRecorder(props) {
      const [recording, setRecording] = useState(false);
      const [micStream, setMicStream] = useState();
      const [audioBuffer] = useState(
        (function() {
          let buffer = [];
          function add(raw) {
            buffer = buffer.concat(...raw);
            return buffer;
          }
          function newBuffer() {
            console.log("resetting buffer");
            buffer = [];
          }
  
          return {
            reset: function() {
              newBuffer();
            },
            addData: function(raw) {
              return add(raw);
            },
            getData: function() {
              return buffer;
            }
          };
        })()
      );
  
      async function startRecording() {
        console.log('start recording');
        audioBuffer.reset();
  
        window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
          const startMic = new mic();
  
          startMic.setStream(stream);
          startMic.on('data', (chunk) => {
            var raw = mic.toRaw(chunk);
            if (raw == null) {
              return;
            }
            audioBuffer.addData(raw);
  
          });
  
          setRecording(true);
          setMicStream(startMic);
        });
      }
  
      async function stopRecording() {
        console.log('stop recording');
        const { finishRecording } = props;
  
        micStream.stop();
        setMicStream(null);
        setRecording(false);
  
        const resultBuffer = audioBuffer.getData();
  
        if (typeof finishRecording === "function") {
          finishRecording(resultBuffer);
        }
  
      }
  
      return (
        <div className="audioRecorder">
          <div>
              {recording && <IconButton color="warning">
                <MicIcon onClick={stopRecording} />
              </IconButton>}
              {!recording && <IconButton color="primary">
                <MicIcon onClick={startRecording} />
              </IconButton>}
          </div>
        </div>
      );
    }
  
    function convertFromBuffer(bytes) {
      setResponse('Transcribing audio...');
  
      Predictions.convert({
        transcription: {
          source: {
            bytes
          },
          language: "en-US",
        },
      }).then(({ transcription: { fullText } }) => setResponse(fullText)) // fullText is the transcribed text
        .catch(err => setResponse(JSON.stringify(err, null, 2)))
    }
  
    return (
      <div className="Text">
        <div>
          <h3>Voice search</h3>
          <Search/>
          <AudioRecorder finishRecording={convertFromBuffer} />
          <p>{response}</p>
        </div>
      </div>
    );
  }