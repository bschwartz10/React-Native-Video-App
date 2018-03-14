import { Constants, Camera, FileSystem, Permissions } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import VideoScreen from './VideoScreen';

// Camera boilerplate code is from Expo's Camera API and example app:
// https://docs.expo.io/versions/latest/sdk/camera.html
// https://github.com/expo/camerja

export default class CameraScreen extends React.Component {
  state = {
    zoom: 0,
    type: 'back',
    showVideo: false,
    permissionsGranted: false,
    recording: false,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });
  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'videos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  toggleView() {
    this.setState({
      showVideo: !this.state.showVideo,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  recordVideo = async function() {
    if (this.camera) {
      this.setState({recording: true})
      this.camera.recordAsync().then(data => {
        FileSystem.moveAsync({
          from: data.uri,
          to: `${FileSystem.documentDirectory}videos/Video_1.mov`,
        }).then(() => {
          Vibration.vibrate();
        });
      });
    }
  };

  stopRecording() {
    if (this.camera) {
      this.camera.stopRecording()
      this.setState({recording: false})
    }
  };

  renderGallery() {
    return <VideoScreen onPress={this.toggleView.bind(this)} />;
  }

  renderNoPermissions() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  renderCamera() {
    return (
      <Camera
        ref={ref => {this.camera = ref;}}
        style={{flex: 1,}}
        type={this.state.type}
        zoom={this.state.zoom}>
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: Constants.statusBarHeight / 2,
          }}>
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
            <Text style={styles.flipText}> FLIP </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginBottom: -5,
          }}>
        </View>
        <View
          style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
            onPress={this.zoomIn.bind(this)}>
            <Text style={styles.flipText}> + </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
            onPress={this.zoomOut.bind(this)}>
            <Text style={styles.flipText}> - </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.recording ? true : false}
            style={this.state.recording ?
              [styles.flipButton, styles.disabledButton, { flex: 0.3, alignSelf: 'flex-end' }] :
              [styles.flipButton, styles.recordButton, { flex: 0.3, alignSelf: 'flex-end' }]
            }
            onPress={this.recordVideo.bind(this)}>
            <Text style={styles.flipText}>Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.recording ? false : true}
            style={this.state.recording ?
              [styles.flipButton, styles.stopButton, { flex: 0.3, alignSelf: 'flex-end' }] :
              [styles.flipButton, styles.disabledButton, { flex: 0.3, alignSelf: 'flex-end' }]
            }
            onPress={this.stopRecording.bind(this)}>
            <Text style={styles.flipText}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: 'flex-end' }]}
            onPress={this.toggleView.bind(this)}>
            <Text style={styles.flipText}>Watch</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = this.state.showVideo ? this.renderGallery() : cameraScreenContent;
    return <View style={styles.container}>{content}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  recordButton: {
    backgroundColor: 'darkseagreen',
  },
  stopButton: {
    backgroundColor: 'indianred',
  },
  galleryButton: {
    backgroundColor: 'orange',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
});
