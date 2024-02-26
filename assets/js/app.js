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

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");

const app = {
  currentIndex: 0,
  isPlaying: false,
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
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
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
      _this.nextSong();
      audio.play();
    };

    // xu ly khi prev song
    prevBtn.onclick = function () {
      _this.prevSong();
      audio.play();
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    console.log(heading, cdThumb, audio);
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
  start: function () {
    // dinh nghia cac props
    this.defineProperties();

    // Xu ly su kien
    this.handleEvents();

    //Tải tt bài hát 1st vào UI
    this.loadCurrentSong();

    this.render();
  },
};

app.start();
