const USERNAME_REGEX = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g;
const MENTION_REGEX = /@(?=[a-zA-Z0-9._]{4,20}(?:\s|$))(?!.*[_.]{2})[^_.].*[^_.]/ig;


export { MENTION_REGEX, USERNAME_REGEX };

