/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "mp3-player-f8";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Cố hương",
      singer: "Li Yugang",
      path: "./assets/music/cohuong.m4a",
      image: "./assets/img/pic1.jpg",
    },
    {
      name: "Hoa Hạ",
      singer: "Li Yugang",
      path: "./assets/music/hoaha.mp3",
      image: "./assets/img/pic2.jpg",
    },
    {
      name: "Nhìn xung quanh",
      singer: "Li Yugang",
      path: "./assets/music/nhinxungquanh.mp3",
      image: "./assets/img/pic3.jpg",
    },
    {
      name: "Trường Xuân",
      singer: "Li Yugang",
      path: "./assets/music/truongxuan.m4a",
      image: "./assets/img/pic4.jpg",
    },
    {
      name: "Nhìn xung quanh 2",
      singer: "Li Yugang",
      path: "./assets/music/nhinxungquanh.mp3",
      image: "./assets/img/pic3.jpg",
    },
    {
      name: "Trường Xuân 2",
      singer: "Li Yugang",
      path: "./assets/music/truongxuan.m4a",
      image: "./assets/img/pic4.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div
                    class="thumb"
                    style="
                    background-image: url('${song.image}');
                    "
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  // getter
  defineProperties: function () {
    // dinh nghia thuoc tinh cho object
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this; //gan this ben ngoai
    const cdWidth = cd.offsetWidth;

    // xu ly quay/dung cd-thumb
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      iterations: Infinity, //vo han
    });

    cdThumbAnimate.pause();

    // xu ly zoom +- CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWith = cdWidth - scrollTop;

      cd.style.width = newCdWith > 0 ? newCdWith + "px" : 0;
      cd.style.opacity = newCdWith / cdWidth;
    };

    //xu ly khi click play - tach kiem trang play/pause rieng theo audio
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        // _this.isPlaying = false;
        // player.classList.remove("playing");
        audio.pause();
      } else {
        // _this.isPlaying = true;
        // player.classList.add("playing");
        audio.play();
      }
    };

    // khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song bi pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //xu ly khi tua song
    progress.onchange = function (e) {
      //e tuong tu progress
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // xu ly khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xu ly khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xu ly bat/tat random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xu ly khi click repeat button
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //xu ly next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //play song when click on playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || !e.target.closest(".option")) {
        //xu ly khi click vao song
        if (songNode) {
          //console.log(songNode.getAttribute("data-index")); //songNode.dataset.index
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        //xu ly khi click vao option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  //scroll to active song
  scrollToActiveSong: function () {
    //delay to load
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    //random # bai hien tai
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // load config into app
    this.loadConfig();

    // dinh nghia cac props
    this.defineProperties();

    // Xu ly su kien
    this.handleEvents();

    //Tải tt bài hát 1st vào UI
    this.loadCurrentSong();

    // render playlist
    this.render();

    // load config
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
