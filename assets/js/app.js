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

const app = {
  currentIndex: 0,
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
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWith = cdWidth - scrollTop;

      cd.style.width = newCdWith > 0 ? newCdWith + "px" : 0;
      cd.style.opacity = newCdWith / cdWidth;
    };
  },
  loadCurrentSong: function () {},
  start: function () {
    this.defineProperties();
    this.handleEvents();

    //Tải tt bài hát 1st vào UI
    this.loadCurrentSong();

    this.render();
  },
};

app.start();
