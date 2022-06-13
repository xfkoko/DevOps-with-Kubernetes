const getString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    console.log(new Date(), randomstring);
    setTimeout(getString, 5000);
}

getString();