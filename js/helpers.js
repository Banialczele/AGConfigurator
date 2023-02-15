function setAttributes(el, attrs) {
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
}

function setDate() {
    const date = new Date();
    return `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
}