/* global describe it */
var expect = require('expect.js')
var match = require('../lib/match')

describe('match', function () {
  describe('protocol', function () {
    it('should return true if protocol matches', function () {
      expect(match('http://', 'http://')).to.eql(true)
      expect(match('https://', 'https://')).to.eql(true)
    })
    it('should return false if protocol does not match', function () {
      expect(match('http://', 'https://')).to.eql(false)
      expect(match('https://', 'http://')).to.eql(false)
      expect(match('http://a.com/a/b?a=b#c=d', 'http://')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', 'https://')).to.eql(true)
    })
    it('should ignore protocol if omitted', function () {
      expect(match('http://a.com/a/b?a=b#c=d', 'a.com/a/b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', 'a.com/a/b')).to.eql(true)
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
      expect(match('https://a.com/blah', 'https://')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '?a=b')).to.eql(true)
      expect(match('https://a.com/a/b?a=b#c=d', '#c=d')).to.eql(true)
    })
    it('should treat forwardslash and no forwardslash as equivalent', function () {
      expect(match('www.a.com', '/')).to.eql(true)
      expect(match('www.a.com?a=b', '/')).to.eql(true)
      expect(match('www.a.com#asd', '/')).to.eql(true)
    })
    describe('expect path mode', function () {
      describe('when the user wants to match on domain and doesnt specify a path', function () {
        it('should pretend the user specified a path', function () {
          expect(match('a.com', 'a.com', true)).to.eql(true)
          expect(match('a.com/', 'a.com', true)).to.eql(true)
          expect(match('a.com/some/path', 'a.com', true)).to.eql(false)
        })
      })
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
      expect(match('https://a.com/blah', 'https://')).to.eql(true)
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
})
