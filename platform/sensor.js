
exports.getText = function(sensor) {
    if(sensor <= 500){
        return "LOW";
    }else if(sensor <= 100){
        return "MEDIUM";
    }else{
        return "HIGH";
    }
}
