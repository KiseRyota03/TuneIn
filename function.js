const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const MUSIC_STORAGE_KEY = "MUSIC";

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const radBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");


const app = {
  currentIndex: 0,
  isPlaying: false, // mặc định không chạy bài hát
  isRandom: false, // shuffle
  isRepeat: false, // repeat
  config: JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",

      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
    {
      name: "Chìm Sâu",
      singers: "MCK & Trung Trần",
      image: "/assets/img/song1.jpg",
      path: "/assets/music/song1.mp3",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index= "${index}">
            <div class="thumb" 
            style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singers}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(app, "currentSong", {
      get: function () {
        return app.songs[app.currentIndex];
      },
    });
  },

  nextSong: function () {
    this.currentIndex++;
    // reset lại đến đầu
    if (this.currentIndex >= this.songs.length) {
      this.currentSong = 0;
    }
    app.loadCurrentSong(); // chuyển bài và chạy bài mới
  },

  prevSong: function () {
    this.currentIndex--;
    // reset lại đến đầu
    if (this.currentIndex < 0) {
      this.currentSong = this.songs.length - 1;
    }
    app.loadCurrentSong(); // chuyển bài và chạy bài mới
  },

  loadConfig: function () {
    app.isRandom = app.config.isRandom
    app.isRepeat = app.config.isRepeat
  },

  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * app.currentIndex);
    } while (newIndex === app.currentIndex);

    app.currentIndex = newIndex;
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },

  loadCurrentSong: function () {
    heading.textContent = app.currentSong.name;
    cdThumb.style.backgroundImage = `url('${app.currentSong.image}')`;
    audio.src = app.currentSong.path;
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    // quay CD
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    // phóng to, thu nhỏ khi cuộn chuột
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      // giảm width = giảm height

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // click play btn
    playBtn.onclick = function () {
      if (playBtn.isPlaying) audio.pause();
      else audio.play();

      audio.onplay = function () {
        cdThumbAnimate.play();
        playBtn.isPlaying = true;
        player.classList.add("playing");
      };
      audio.onpause = function () {
        cdThumbAnimate.pause();
        playBtn.isPlaying = false;
        player.classList.remove("playing");
      };

      // tua
      audio.ontimeupdate = function () {
        if (audio.duration) {
             const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
          progress.value = progressPercent;
        }
      };

      progress.onchange = function (e) {
        const seekTime = progress.value/ 100 * audio.duration;

        audio.currentTime = seekTime;
      };

      nextBtn.onclick = function () {
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.nextSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      };

      prevBtn.onclick = function () {
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.prevSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      };

      // Xử lý bật / tắt random
      radBtn.onclick = function () {
        app.isRandom = !app.isRandom;
        app.setConfig('isRandom', app.isRandom);
        radBtn.classList.toggle('active', app.isRandom);
      };

      // Xử lý phát lại bài hát
      repeatBtn.onclick = function () {
        app.isRepeat = ! app.isRepeat;
        app.setConfig("isRepeat", app.isRepeat);
        repeatBtn.classList.toggle("active", app.isRepeat);
      };

      // Xử lý next song khi audio ended

      audio.oneneded = function () {
        if (app.isRepeat) {
          app.loadCurrentSong();
          audio.play();
        } else {
          nextBtn.click();
        }
      };

      playlist.onclick = function (e) {
        // xử lý click vào song
        const songNode = e.target.closest(".song:not(.active)");
        const songNode2 = e.target.closest(".song:not(.active)");

        if (songNode || songNode2) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }

        if (songNode2) {
        }
      };
    };
  },

  start: function () {
    // đọc từ localStorage
    this.loadConfig(),
    // lắng nghe sự kiện (DOM event)
    this.handleEvents(),
      // thuộc tính object
      this.defineProperties(),
      // thông tin bài hát đầu tiên
      this.loadCurrentSong(),
      // render giao diện
      this.render();
      // hiển thị trạng thái ban đầu của 2 nút
      radBtn.classList.toggle('active', app.isRandom);
      repeatBtn.classList.toggle("active", app.isRepeat);

  },
};

app.start();
