import { Node, AudioSource, AudioClip, resources, director } from 'cc';

// TODO: 预加载
export class AudioMgr {
    private static _inst: AudioMgr;
    public static get inst(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }

    private _BGM_AudioSource: AudioSource;   // 背景音乐
    private _SFX_AudioSourcePool: AudioSource[] = [];   // 音效 AudioSource 池
    // 音效池大小
    private readonly SFX_POOL_SIZE = 4;

    private _enableBGM: boolean = true;
    private _enableSFX: boolean = true;

    private _BGM_VOLUME = 0.5;
    private _SFX_VOLUME = 0.5;

    // 音频文件路径
    private _BGM_PATH = 'Audio/BGM';
    private _BUTTON_CLICKED_PATH = 'Audio/ButtonClicked';
    private _BALL_MERGE_PATH = 'Audio/BallMerge';
    private _BALLS_HIT_PATH = 'Audio/BallsHit';

    constructor() {
        // 创建持久化节点
        let audioMgrNode = new Node();
        audioMgrNode.name = '__audioMgr__';
        director.getScene().addChild(audioMgrNode);
        director.addPersistRootNode(audioMgrNode);

        this._BGM_AudioSource = audioMgrNode.addComponent(AudioSource);
        // 防止切换场景时，已经暂停的BGM被自动播放
        this._BGM_AudioSource.playOnAwake = false;
        
        // 创建音效AudioSource池
        for (let i = 0; i < this.SFX_POOL_SIZE; i++) {
            const sfxAudioSource = audioMgrNode.addComponent(AudioSource);
            this._SFX_AudioSourcePool.push(sfxAudioSource);
        }
    }

    get enableBGM(): boolean {
        return this._enableBGM;
    }

    set enableBGM(value: boolean) {
        this._enableBGM = value;
        
        if (!value) {
            this.pauseBGM();
        } else {
            this.resumeBGM();
        }
    }

    get enableSFX(): boolean {
        return this._enableSFX;
    }

    set enableSFX(value: boolean) {
        this._enableSFX = value;
    }

    get BGM_VOLUME(): number {
        return this._BGM_VOLUME;
    }
    set BGM_VOLUME(value: number) {
        this._BGM_VOLUME = value;
        this._BGM_AudioSource.volume = value;
    }

    get SFX_VOLUME(): number {
        return this._SFX_VOLUME;
    }
    set SFX_VOLUME(value: number) {
        this._SFX_VOLUME = value;
    }

    public getBGM_AudioSource() {
        return this._BGM_AudioSource;
    }
    
    /**
     * 获取可用的音效 AudioSource
     * @returns 可用的 AudioSource，如果没有可用的则返回 null
     */
    private getAvailableSFXAudioSource(): AudioSource | null {
        // 查找没有在播放的 AudioSource
        for (const audioSource of this._SFX_AudioSourcePool) {
            if (!audioSource.playing) {
                return audioSource;
            }
        }
        
        console.warn('所有音效 AudioSource 都在播放，无空闲音效AudioSource');
        return null;
    }
    
    /**
     * 播放音效
     * @param sound 音频文件路径或 AudioClip
     * @param volume 音量
     */
    playOneShot(sound: AudioClip | string, volume: number = this.SFX_VOLUME) {
        if (!this.enableSFX) {
            return;
        }

        const audioSource = this.getAvailableSFXAudioSource();
        
        if (!audioSource) {
            console.error('没有可用的音效 AudioSource');
            return;
        }
        
        if (sound instanceof AudioClip) {
            audioSource.playOneShot(sound, volume);
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.error(`加载音效失败: ${sound}`, err);
                } else {
                    audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * 播放背景音乐
     * @param sound 音频文件路径或 AudioClip
     * @param volume 音量
     */
    play(sound: AudioClip | string, volume: number = this.BGM_VOLUME) {
        if (!this.enableBGM) {
            return;
        }

        if (sound instanceof AudioClip) {
            // 直接播放 AudioClip
            this._BGM_AudioSource.stop();
            this._BGM_AudioSource.clip = sound;
            this._BGM_AudioSource.volume = volume;
            this._BGM_AudioSource.loop = true;
            this._BGM_AudioSource.play();
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.error(`加载背景音乐失败: ${sound}`, err);
                } else {
                    this._BGM_AudioSource.stop();
                    this._BGM_AudioSource.clip = clip;
                    this._BGM_AudioSource.volume = volume;
                    this._BGM_AudioSource.loop = true;
                    this._BGM_AudioSource.play();
                }
            });
        }
    }

    getSFXPoolInfo() {
        const playingCount = this._SFX_AudioSourcePool.filter(as => as.playing).length;
        return {
            totalCount: this.SFX_POOL_SIZE,
            playingCount: playingCount,
            availableCount: this.SFX_POOL_SIZE - playingCount
        };
    }

    stopBGM() {
        this._BGM_AudioSource.stop();
    }

    pauseBGM() {
        this._BGM_AudioSource.pause();
    }

    resumeBGM() {
        this._BGM_AudioSource.play();
    }

    // ========== 便捷播放方法 ==========
    playBGM() {
        this.play(this._BGM_PATH);
    }
    
    playButtonClick() {
        this.playOneShot(this._BUTTON_CLICKED_PATH);
    }

    playBallMerge() {
        this.playOneShot(this._BALL_MERGE_PATH);
    }

    playBallFirstCollision() {
        this.playOneShot(this._BALLS_HIT_PATH);
    }
}