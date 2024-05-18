const TOKENS = `
LeftBrace
RightBrace
RightBracket
LeftParen
RightParen
Keyword
Identifier
Number
String
Period
Plus
Minus
Star
Slash
Eof
`

const KEYWORDS = `
prepare
as
if
elif
else
while
loop
through
`.split('\n').filter(k => k != + '')

let TOKEN_TYPES = {}

TOKENS.split('\n').forEach(t => {
  if (t === '') return

  TOKEN_TYPES[t] = t
})

let digits = '0123456789'
function isdigit(text) {
  return digits.includes(text)
}

let alpha = 'qwertyuiopasdfghjklzxcvbnm'
function isalpha(text) {
  return alpha.includes(text)
}

class Token {
  constructor(type, kind, value) {
    this.type = type
    this.kind = kind
    this.value = value
  }
}

export class Lexer {
  constructor(program) {
    this.program = program
    this.tokens = []
    this.current = 0
    this.line = 1
    this.column = 0
  }

  peek() {
    if (this.current >= this.program.length) return '\0'
    return this.program[this.current]
  }

  advance() {
    if (this.current >= this.program.length) return '\0'
    return this.program[this.current++]
  }

  scanToken() {
    let char = this.advance()
    switch (char) {
      case "(":
        return this.tokens.push(new Token(TOKEN_TYPES.LeftParen, "(", "("))
      case ")":
        return this.tokens.push(new Token(TOKEN_TYPES.RightParen, ")", ")"))
      case "[":
        return this.tokens.push(new Token(TOKEN_TYPES.LeftBracket, "[", "["))
      case "]":
        return this.tokens.push(new Token(TOKEN_TYPES.RightBracket, "]", "]"))
      case "{":
        return this.tokens.push(new Token(TOKEN_TYPES.LeftBrace, "{", "{"))
      case "}":
        return this.tokens.push(new Token(TOKEN_TYPES.RightBrace, "}", "}"))
      case ".":
        return this.tokens.push(new Token(TOKEN_TYPES.Period, ".", "."))
      case "+":
        return this.tokens.push(new Token(TOKEN_TYPES.Plus, "+", "+"))
      case "-":
        return this.tokens.push(new Token(TOKEN_TYPES.Minus, "-", "-"))
      case "*":
        return this.tokens.push(new Token(TOKEN_TYPES.Star, "*", "*"))
      case "/":
        return this.tokens.push(new Token(TOKEN_TYPES.Slash, "/", "/"))
      case "\n":
      case " ":
        return
      default:
        if (isdigit(char)) {
          let number = [char]
          while (isdigit(this.peek()) || (!number.includes(".") && char == ".")) {
            number.push(this.advance())
          }
          return this.tokens.push(
            new Token(
              TOKEN_TYPES.Number,
              number.join(''),
              Number(number.join(''))
            )
          )
        } else if (isalpha(char)) {
          let chars = [char]
          while (isalpha(this.peek())) {
            chars.push(this.advance())
          }

          chars = chars.join('')
          if (KEYWORDS.includes(chars)) {
            return this.tokens.push(new Token(TOKEN_TYPES.Keyword, chars, chars))
          } else {
            return this.tokens.push(new Token(TOKEN_TYPES.Identifier, chars, chars))
          }
        }
    }
  }

  scanTokens() {
    while (this.peek() !== "\0") this.scanToken()
    this.tokens.push(new Token(TOKEN_TYPES.Eof, "\0", "\0"))
    return this.tokens
  }
}