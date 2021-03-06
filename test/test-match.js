/* global describe it */
var expect = require('expect.js')
var match = require('../lib/match')

describe('match', function () {
  describe('protocol', function () {
    it('should ignore protocol', function () {
      expect(match('http://a.com/a/b?a=b#c=d', 'https://a.com/a/b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', 'http://a.com/a/b')).to.eql(true)
    })
  })
  describe('domain', function () {
    it('should return true if domain matches', function () {
      expect(match('a.com', 'a.com')).to.eql(true)
      expect(match('http://a.com/?a=b#c=d', 'a.com')).to.eql(true)
      expect(match('http://a.com/a/b?a=b#c=d', 'a.com')).to.eql(true)
      expect(match('http://a.com/a/b?a=b#c=d', 'a.com/a/b')).to.eql(true)
    })
    it('should return false if domain does not match', function () {
      expect(match('a.com', 'b.com')).to.eql(false)
      expect(match('http://a.com?a=b#c=d', 'b.com')).to.eql(false)
      expect(match('http://a.com/a/b?a=b#c=d', 'b.com/a/b')).to.eql(false)
    })
    it('should ignore domain if omitted', function () {
      expect(match('http://a.com/a', '/a')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '/a/b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '?a=b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '#c=d')).to.eql(true)
    })
    it('should treat forwardslash and no forwardslash as equivalent', function () {
      expect(match('www.a.com', '/')).to.eql(true)
      expect(match('www.a.com?a=b', '/')).to.eql(true)
      expect(match('www.a.com#asd', '/')).to.eql(true)
    })
  })
  describe('path', function () {
    it('should return true if path matches', function () {
      expect(match('/', '/')).to.eql(true)
      expect(match('/a/b', '/a/b')).to.eql(true)
    })
    it('should return false if path does not match', function () {
      expect(match('/a/', '/a')).to.eql(false)
      expect(match('/a/b', '/a')).to.eql(false)
      expect(match('https://a.com/a/b?a=b#c=d', '/a')).to.eql(false)
    })
    it('should ignore path if omitted', function () {
      expect(match('https://a.com/a/b?a=b#c=d', '?a=b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '#c=d')).to.eql(true)
    })
  })
  describe('query', function () {
    it('should return true if query matches', function () {
      expect(match('?a=b', '?a=b')).to.eql(true)
      expect(match('?a=b&d=c', '?a=b&d=c')).to.eql(true)
    })
    it('should be order insensitive', function () {
      expect(match('?a=b&d=c', '?d=c&a=b')).to.eql(true)
    })
    it('should return false if query does not match', function () {
      expect(match('?a=b', '?b=c')).to.eql(false)
      expect(match('?a=b&d=c', '?a=b&d=a')).to.eql(false)
    })
    it('should ignore query if omitted', function () {
      expect(match('http://a.com/blah?a=b', 'http://a.com/blah')).to.eql(true)
      expect(match('https://a.com/blah/about', 'https://a.com/blah/about')).to.eql(true)
    })
  })
  describe('hash', function () {
    it('should return true if query matches', function () {
      expect(match('#a=b', '#a=b')).to.eql(true)
      expect(match('#a=b&d=c', '#a=b&d=c')).to.eql(true)
    })
    it('should be order insensitive', function () {
      expect(match('#a=b&d=c', '#d=c&a=b')).to.eql(true)
    })
    it('should return false if query does not match', function () {
      expect(match('#a=b', '#b=c')).to.eql(false)
      expect(match('#a=b&d=c', '#a=b&d=a')).to.eql(false)
    })
    it('should ignore query if omitted', function () {
      expect(match('http://a.com/blah#a=b', 'http://a.com/blah')).to.eql(true)
      expect(match('https://a.com/blah/about', 'https://a.com/blah/about')).to.eql(true)
    })
  })
  describe('wildcards', function () {
    it('should support wildcards', function () {
      expect(match('http://a.com/a/bcd/e/file.js', 'http://a.com/a/*/*/*.js')).to.eql(true)
      expect(match('https://a.b.c.domain.com/blah?a=b#blah', '*.domain.com')).to.eql(true)
      expect(match('https://www.domain.com/a/1234/b', 'www.domain.com/a/*/b')).to.eql(true)
      expect(match('https://www.domain.com/a/b/file.js', 'www.domain.com/**.js')).to.eql(true)
    })
    it('should respect double asterisk', function () {
      expect(match('http://a.com/a/bcd/e/file.js', 'http://a.com/**.js')).to.eql(true)
      expect(match('http://a.com/a/bcd/e/file.js', 'http://a.com/*.js')).to.eql(false)
      expect(match('http://a.com/a/bcd/e/file.js', 'http://a.com/?.js')).to.eql(false)
    })
  })
})
