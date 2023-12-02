const inputs = {
    left: false,
    right: false
}

window.onkeydown = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            inputs.left = true;
            break;
        case 'ArrowRight':
            inputs.right = true;
            break;
        case 'KeyA':
            inputs.left = true;
            break;
        case 'KeyD':
            inputs.right = true;
            break;
    }
    // console.log(inputs.left, inputs.right, inputs.up, inputs.down);
}
window.onkeyup = (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            inputs.left = false;
            break;
        case 'ArrowRight':
            inputs.right = false;
            break;
        case 'KeyA':
            inputs.left = false;
            break;
        case 'KeyD':
            inputs.right = false;
            break;
    }
    // console.log(inputs.left, inputs.right, inputs.up, inputs.down);
}