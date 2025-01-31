﻿/*
 * Playlist Object for the jPlayer Plugin
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2013 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.3.0
 * Date: 20th April 2013
 *
 * Requires:
 *  - jQuery 1.7.0+
 *  - jPlayer 2.3.0+
 */
(function(b, f) {
    jPlayerPlaylist = function(a, c, d) {
        var e = this;
        this.current = 0;
        this.removing = this.shuffled = this.loop = !1;
        this.cssSelector = b.extend({}, this._cssSelector, a);
        this.options = b.extend(!0, {
            keyBindings: {
                next: {
                    key: 39,
                    fn: function() {
                        e.next()
                    }
                },
                previous: {
                    key: 37,
                    fn: function() {
                        e.previous()
                    }
                }
            }
        }, this._options, d);
        this.playlist = [];
        this.original = [];
        this._initPlaylist(c);
        this.cssSelector.title = this.cssSelector.cssSelectorAncestor + " .jp-title";
        this.cssSelector.playlist = this.cssSelector.cssSelectorAncestor + " .jp-playlist";
        this.cssSelector.next = this.cssSelector.cssSelectorAncestor + " .jp-next";
        this.cssSelector.previous = this.cssSelector.cssSelectorAncestor + " .jp-previous";
        this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + " .jp-shuffle";
        this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + " .jp-shuffle-off";
        this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor;
        this.options.repeat = function(a) {
            e.loop = a.jPlayer.options.loop
        }
        ;
        b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ready, function() {
            e._init()
        });
        b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ended, function() {
            e.next()
        });
        b(this.cssSelector.jPlayer).bind(b.jPlayer.event.play, function() {/*b(this).jPlayer("pauseOthers")*/});
        b(this.cssSelector.jPlayer).bind(b.jPlayer.event.resize, function(a) {
            a.jPlayer.options.fullScreen ? b(e.cssSelector.title).show() : b(e.cssSelector.title).hide()
        });
        b(this.cssSelector.previous).click(function() {
            e.previous();
            b(this).blur();
            return !1
        });
        b(this.cssSelector.next).click(function() {
            e.next();
            b(this).blur();
            return !1
        });
        b(this.cssSelector.shuffle).click(function() {
            e.shuffle(!0);
            return !1
        });
        b(this.cssSelector.shuffleOff).click(function() {
            e.shuffle(!1);
            return !1
        }).hide();
        this.options.fullScreen || b(this.cssSelector.title).hide();
        b(this.cssSelector.playlist + " ul").empty();
        this._createItemHandlers();
        b(this.cssSelector.jPlayer).jPlayer(this.options)
    }
    ;
    jPlayerPlaylist.prototype = {
        _cssSelector: {
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        },
        _options: {
            playlistOptions: {
                autoPlay: !1,
                loopOnPrevious: !1,
                shuffleOnLoop: !0,
                enableRemoveControls: !1,
                displayTime: "slow",
                addTime: "fast",
                removeTime: "fast",
                shuffleTime: "slow",
                itemClass: "jp-playlist-item",
                freeGroupClass: "jp-free-media",
                freeItemClass: "jp-playlist-item-free",
                removeItemClass: "jp-playlist-item-remove"
            }
        },
        option: function(a, b) {
            if (b === f)
                return this.options.playlistOptions[a];
            this.options.playlistOptions[a] = b;
            switch (a) {
            case "enableRemoveControls":
                this._updateControls();
                break;
            case "itemClass":
            case "freeGroupClass":
            case "freeItemClass":
            case "removeItemClass":
                this._refresh(!0),
                this._createItemHandlers()
            }
            return this
        },
        _init: function() {
            var a = 
            this;
            this._refresh(function() {
                a.options.playlistOptions.autoPlay ? a.play(a.current) : a.select(a.current)
            })
        },
        _initPlaylist: function(a) {
            this.current = 0;
            this.removing = this.shuffled = !1;
            this.original = b.extend(!0, [], a);
            this._originalPlaylist()
        },
        _originalPlaylist: function() {
            var a = this;
            this.playlist = [];
            b.each(this.original, function(b) {
                a.playlist[b] = a.original[b]
            })
        },
        _refresh: function(a) {
            var c = this;
            if (a && !b.isFunction(a))
                b(this.cssSelector.playlist + " ul").empty(),
                b.each(this.playlist, function(a) {
                    b(c.cssSelector.playlist + 
                    " ul").append(c._createListItem(c.playlist[a]))
                }),
                this._updateControls();
            else {
                var d = b(this.cssSelector.playlist + " ul").children().length ? this.options.playlistOptions.displayTime : 0;
                b(this.cssSelector.playlist + " ul").slideUp(d, function() {
                    var d = b(this);
                    b(this).empty();
                    b.each(c.playlist, function(a) {
                        d.append(c._createListItem(c.playlist[a]))
                    });
                    c._updateControls();
                    b.isFunction(a) && a();
                    c.playlist.length ? b(this).slideDown(0 /*c.options.playlistOptions.displayTime*/) : b(this).show()
                })
            }
        },
        _createListItem: function(a) {
            var c = 
            this
              , d = "<li><div>"
              , d = d + ("<a href='javascript:;' class='" + this.options.playlistOptions.removeItemClass + "'>&times;</a>");
            if (a.free) {
                var e = !0
                  , d = d + ("<span class='" + this.options.playlistOptions.freeGroupClass + "'>(");
                b.each(a, function(a, f) {
                    b.jPlayer.prototype.format[a] && (e ? e = !1 : d += " | ",
                    d += "<a class='" + c.options.playlistOptions.freeItemClass + "' href='" + f + "' tabindex='1'>" + a + "</a>")
                });
                d += ")</span>"
            }
            d += "<a href='javascript:;' class='" + this.options.playlistOptions.itemClass + "' tabindex='1'>" + a.title + (a.artist ? 
            " <span class='jp-artist'>by " + a.artist + "</span>" : "") + "</a>";
            return d += "</div></li>"
        },
        _createItemHandlers: function() {
            var a = this;
            b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.itemClass).on("click", "a." + this.options.playlistOptions.itemClass, function() {
                var c = b(this).parent().parent().index();
                a.current !== c ? a.play(c) : b(a.cssSelector.jPlayer).jPlayer("play");
                b(this).blur();
                return !1
            });
            b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.freeItemClass).on("click", 
            "a." + this.options.playlistOptions.freeItemClass, function() {
                b(this).parent().parent().find("." + a.options.playlistOptions.itemClass).click();
                b(this).blur();
                return !1
            });
            b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.removeItemClass).on("click", "a." + this.options.playlistOptions.removeItemClass, function() {
                var c = b(this).parent().parent().index();
                a.remove(c);
                b(this).blur();
                return !1
            })
        },
        _updateControls: function() {
            this.options.playlistOptions.enableRemoveControls ? b(this.cssSelector.playlist + 
            " ." + this.options.playlistOptions.removeItemClass).show() : b(this.cssSelector.playlist + " ." + this.options.playlistOptions.removeItemClass).hide();
            this.shuffled ? (b(this.cssSelector.shuffleOff).show(),
            b(this.cssSelector.shuffle).hide()) : (b(this.cssSelector.shuffleOff).hide(),
            b(this.cssSelector.shuffle).show())
        },
        _highlight: function(a) {
            this.playlist.length && a !== f && (b(this.cssSelector.playlist + " .jp-playlist-current").removeClass("jp-playlist-current"),
            b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) + 
            ")").addClass("jp-playlist-current").find(".jp-playlist-item").addClass("jp-playlist-current"),
            b(this.cssSelector.title + " li").html(this.playlist[a].title + (this.playlist[a].artist ? " <span class='jp-artist'>by " + this.playlist[a].artist + "</span>" : "")))
        },
        setPlaylist: function(a) {
            this._initPlaylist(a);
            this._init()
        },
        add: function(a, c) {
            b(this.cssSelector.playlist + " ul").append(this._createListItem(a)).find("li:last-child").hide().slideDown(this.options.playlistOptions.addTime);
            this._updateControls();
            this.original.push(a);
            this.playlist.push(a);
            c ? this.play(this.playlist.length - 1) : 1 === this.original.length && this.select(0)
        },
        remove: function(a) {
            var c = this;
            if (a === f)
                return this._initPlaylist([]),
                this._refresh(function() {
                    b(c.cssSelector.jPlayer).jPlayer("clearMedia")
                }),
                !0;
            if (this.removing)
                return !1;
            a = 0 > a ? c.original.length + a : a;
            0 <= a && a < this.playlist.length && (this.removing = !0,
            b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) + ")").slideUp(this.options.playlistOptions.removeTime, function() {
                b(this).remove();
                if (c.shuffled) {
                    var d = 
                    c.playlist[a];
                    b.each(c.original, function(a) {
                        if (c.original[a] === d)
                            return c.original.splice(a, 1),
                            !1
                    })
                } else
                    c.original.splice(a, 1);
                c.playlist.splice(a, 1);
                c.original.length ? a === c.current ? (c.current = a < c.original.length ? c.current : c.original.length - 1,
                c.select(c.current)) : a < c.current && c.current-- : (b(c.cssSelector.jPlayer).jPlayer("clearMedia"),
                c.current = 0,
                c.shuffled = !1,
                c._updateControls());
                c.removing = !1
            }));
            return !0
        },
        select: function(a) {
            a = 0 > a ? this.original.length + a : a;
            0 <= a && a < this.playlist.length ? (this.current = 
            a,
            this._highlight(a),
            b(this.cssSelector.jPlayer).jPlayer("setMedia", this.playlist[this.current])) : this.current = 0
        },
        play: function(a) {
            a = 0 > a ? this.original.length + a : a;
            0 <= a && a < this.playlist.length ? this.playlist.length && (this.select(a),
            b(this.cssSelector.jPlayer).jPlayer("play")) : a === f && b(this.cssSelector.jPlayer).jPlayer("play")
        },
        pause: function() {
            b(this.cssSelector.jPlayer).jPlayer("pause")
        },
        next: function() {
            var a = this.current + 1 < this.playlist.length ? this.current + 1 : 0;
            this.loop ? 0 === a && this.shuffled && this.options.playlistOptions.shuffleOnLoop && 
            1 < this.playlist.length ? this.shuffle(!0, !0) : this.play(a) : 0 < a && this.play(a)
        },
        previous: function() {
            var a = 0 <= this.current - 1 ? this.current - 1 : this.playlist.length - 1;
            (this.loop && this.options.playlistOptions.loopOnPrevious || a < this.playlist.length - 1) && this.play(a)
        },
        shuffle: function(a, c) {
            var d = this;
            a === f && (a = !this.shuffled);
            (a || a !== this.shuffled) && b(this.cssSelector.playlist + " ul").slideUp(this.options.playlistOptions.shuffleTime, function() {
                (d.shuffled = a) ? d.playlist.sort(function() {
                    return 0.5 - Math.random()
                }) : 
                d._originalPlaylist();
                d._refresh(!0);
                c || !b(d.cssSelector.jPlayer).data("jPlayer").status.paused ? d.play(0) : d.select(0);
                b(this).slideDown(d.options.playlistOptions.shuffleTime)
            })
        }
    }
})(jQuery);
