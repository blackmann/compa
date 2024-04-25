function ellipsize(str: string, length = 48) {
    if (str.length > length) {
        return `${str.substring(0, length)}...`;
    }
    return str;
}

export { ellipsize };
