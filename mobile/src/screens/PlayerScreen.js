import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }) {
  const { channel } = route.params;
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef(null);

  useEffect(() => {
    api.post(`/channels/${channel.id}/watch`).catch(() => {});
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (videoRef.current) {
        videoRef.current.playAsync();
      }
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

  const handlePlaybackStatus = (playbackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.positionMillis) {
      setCurrentTime(playbackStatus.positionMillis);
    }
    if (playbackStatus.isLoaded) {
      setLoading(false);
    }
    if (playbackStatus.error) {
      setError('Erro ao carregar stream');
      setLoading(false);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 5000);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
    showControlsTemporarily();
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={showControlsTemporarily}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: channel.stream_url }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatus}
          onError={() => { setError('Stream indisponível'); setLoading(false); }}
        />
      </TouchableOpacity>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Carregando {channel.name}...</Text>
        </View>
      )}

      {/* Error overlay */}
      {error && (
        <View style={styles.overlay}>
          <Icon name="alert-circle" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => { setError(null); setLoading(true); videoRef.current?.replayAsync(); }}
            hasTVPreferredFocus={true}
          >
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: 'transparent', borderColor: '#6366f1', marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.retryText, { color: '#6366f1' }]}}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls overlay */}
      {showControls && !error && (
        <Animated.View style={[styles.controlsOverlay, { opacity: controlsOpacity }]}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.channelInfo}>
              <Text style={styles.channelName}>{channel.name}</Text>
              <Text style={styles.channelCategory}>{channel.category_name || 'Geral'}</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>
          </View>

          {/* Center play/pause */}
          <TouchableOpacity style={styles.centerBtn} onPress={togglePlayPause}>
            <Icon
              name={status.isPlaying ? 'pause-circle' : 'play-circle'}
              size={80}
              color="rgba(255,255,255,0.9)"
            />
          </TouchableOpacity>

          {/* Bottom bar */}
          <View style={styles.bottomBar}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.timeText}>LIVE</Text>
          </View>

          {/* Dica de navegação */}
          <Text style={styles.hintText}>Pressione OK para pausar • ← para voltar</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 18,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    fontSize: 18,
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 30,
    zIndex: 5,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  backBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  channelInfo: {
    flex: 1,
    marginLeft: 16,
  },
  channelName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  channelCategory: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  liveText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerBtn: {
    alignSelf: 'center',
    padding: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginHorizontal: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  hintText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 10,
  },
});
