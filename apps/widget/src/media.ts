export class MediaHandler {
  private mediaRecorder: MediaRecorder | null = null
  private stream: MediaStream | null = null
  private chunks: Blob[] = []

  async startVideoPreview(): Promise<MediaStream | null> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: true,
      })
      return this.stream
    } catch (error) {
      console.error('[RindaAsk] Failed to access camera:', error)
      return null
    }
  }

  async startVideoRecording(): Promise<void> {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: true,
      })
    }

    this.chunks = []

    const options: MediaRecorderOptions = {
      mimeType: this.getSupportedMimeType('video'),
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options)

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    this.mediaRecorder.start(1000)
  }

  async startAudioRecording(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })

    this.chunks = []

    const options: MediaRecorderOptions = {
      mimeType: this.getSupportedMimeType('audio'),
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options)

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    this.mediaRecorder.start(1000)
  }

  async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'video/webm'
        const blob = new Blob(this.chunks, { type: mimeType })

        // Stop all tracks
        this.stream?.getTracks().forEach(track => track.stop())
        this.stream = null
        this.mediaRecorder = null
        this.chunks = []

        resolve(blob)
      }

      this.mediaRecorder.stop()
    })
  }

  private getSupportedMimeType(type: 'video' | 'audio'): string {
    const videoTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ]

    const audioTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
    ]

    const types = type === 'video' ? videoTypes : audioTypes

    for (const mimeType of types) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType
      }
    }

    return types[types.length - 1]
  }

  stopPreview(): void {
    this.stream?.getTracks().forEach(track => track.stop())
    this.stream = null
  }
}
