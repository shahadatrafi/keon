/**
 * reveal.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
! function(a) {
    "use strict";

    function b(a, b, c) {
        var d;
        return function() {
            var e = this,
                f = arguments,
                g = function() {
                    d = null, c || a.apply(e, f)
                },
                h = c && !d;
            clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
        }
    }

    function c(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }

    function j(a) {
        this.options = c({}, this.options), c(this.options, a), this._init()
    }
    var d = document.body,
        e = {
            width: a.innerWidth,
            height: a.innerHeight
        },
        f = {
            animations: Modernizr.cssanimations
        },
        g = {
            WebkitAnimation: "webkitAnimationEnd",
            OAnimation: "oAnimationEnd",
            msAnimation: "MSAnimationEnd",
            animation: "animationend"
        },
        h = g[Modernizr.prefixed("animation")],
        i = function(a, b) {
            var c = function(a) {
                if (f.animations) {
                    if (a.target != this) return;
                    this.removeEventListener(h, c)
                }
                b && "function" == typeof b && b.call()
            };
            f.animations ? a.addEventListener(h, c) : c()
        };
    j.prototype.options = {
        nmbLayers: 1,
        bgcolor: "#fffff",
        effect: "anim--effect",
        onStart: function(a) {
            return !1
        },
        onEnd: function(a) {
            return !1
        }
    }, j.prototype._init = function() {
        this._addLayers(), this.layers = [].slice.call(this.revealerWrapper.children), this._initEvents()
    }, j.prototype._initEvents = function() {
        this.debounceResize = b(function(b) {
            e = {
                width: a.innerWidth,
                height: a.innerHeight
            }
        }, 10), a.addEventListener("resize", this.debounceResize)
    }, j.prototype._addLayers = function() {
        this.revealerWrapper = document.createElement("div"), this.revealerWrapper.className = "revealer", classie.add(d, this.options.effect);
        for (var a = "", b = 0; b < this.options.nmbLayers; ++b) {
            var c = "string" == typeof this.options.bgcolor ? this.options.bgcolor : this.options.bgcolor instanceof Array && this.options.bgcolor[b] ? this.options.bgcolor[b] : "#fff";
            a += '<div style="background-color: ' + c + '" class="revealer__layer"></div>'
        }
        this.revealerWrapper.innerHTML = a, d.appendChild(this.revealerWrapper)
    }, j.prototype.reveal = function(a, b, c) {
        if (this.isAnimating) return !1;
        this.isAnimating = !0, this.direction = a, this.options.onStart(this.direction);
        var d, e, f;
        "left" !== a && "right" !== a || (d = "100vh", e = "100vw", f = "translate3d(-50%,-50%,0) rotate3d(0,0,1," + ("left" === a ? 90 : -90) + "deg) translate3d(0,100%,0)"), this.revealerWrapper.style.width = d, this.revealerWrapper.style.height = e, this.revealerWrapper.style.WebkitTransform = this.revealerWrapper.style.transform = f, this.revealerWrapper.style.opacity = 1, classie.add(this.revealerWrapper, "revealer--" + a || "revealer--right"), classie.add(this.revealerWrapper, "revealer--animate");
        var g = this,
            h = 0;
        this.layers.forEach(function(b) {
            i(b, function() {
                ++h, h === g.options.nmbLayers && (classie.remove(g.revealerWrapper, "revealer--" + a || "revealer--right"), classie.remove(g.revealerWrapper, "revealer--animate"), g.revealerWrapper.style.opacity = 0, g.isAnimating = !1, g.options.onEnd(g.direction))
            })
        }), "function" == typeof c && (this.callbacktimeout && clearTimeout(this.callbacktimeout), this.callbacktimeout = setTimeout(c, b))
    }, j.prototype.destroy = function() {
        classie.remove(d, this.options.effect), a.removeEventListener("resize", this.debounceResize), d.removeChild(this.revealerWrapper)
    }, a.Revealer = j
}(window);