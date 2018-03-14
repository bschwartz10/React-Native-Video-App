import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { Video, FileSystem } from 'expo';

export default class VideoScreen extends React.Component {
  state = {
    playing: false
  };
  _mounted = false;

  componentWillUnmount() {
    this._mounted = false;
  }

  pause() {
    if (this.video) {
      this.video.pauseAsync()
      this.setState({playing: false})
    }
  };

  play() {
    if (this.video) {
      this.video.playAsync()
      this.setState({playing: true})
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.buttons, {alignSelf: 'flex-start'}]}>
          <TouchableOpacity
            style={[styles.flipButton, styles.backButton]} onPress={this.props.onPress}>
            <Text style={styles.flipText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Video
          ref={ref => {this.video = ref;}}
          source={{ uri: `${FileSystem.documentDirectory}videos/Video_1.mov` }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          isLooping
          style={{ width: 400, height: 400 }}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            disabled={this.state.playing ? true : false}
            style={[styles.flipButton, styles.playButton]} onPress={this.play.bind(this)}>
            <Text style={styles.flipText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.playing ? false : true}
            style={[styles.flipButton, styles.pauseButton]} onPress={this.pause.bind(this)}>
            <Text style={styles.flipText}>Pause</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    padding: 20,
    marginBottom: 4,
    flexDirection: 'row',
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
  playButton: {
    backgroundColor: 'darkseagreen',
  },
  pauseButton: {
    backgroundColor: 'indianred',
  },
  backButton: {
    backgroundColor: 'orange',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
});
