var backgroundShader;

function initBackgroundShader() {
    backgroundShader = initShaders("background-vs","background-fs");
    
    // active ce shader
    gl.useProgram(backgroundShader);
    
    // adresse de la texture uHeightfield dans le shader
    backgroundShader.heightfieldUniform = gl.getUniformLocation(backgroundShader, "uHeightfield");
    
    console.log("background shader initialized");
}

function Background(heightfieldTexture) {
    this.heightfieldTexture = heightfieldTexture;

    // un tableau contenant les positions des sommets (sur CPU donc)
    var vertices = [
	-1.0,-1.0, 0.99,
	1.0,-1.0, 0.99,
	1.0, 1.0, 0.99,
	-1.0, 1.0, 0.99
    ];
    
    
    var coords = [
	0.0, 0.0, 
	1.0, 0.0, 
	1.0, 1.0, 
	0.0, 1.0
    ];
    
    var tri = [0,1,2,0,2,3];
    
    this.initParameters();
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // meme principe pour les coords
    this.coordBuffer = gl.createBuffer();
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.enableVertexAttribArray(1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;

    gl.bindVertexArray(null);

    console.log("background initialized");
}

Background.prototype.shader = function() {
    return backgroundShader;
}

Background.prototype.initParameters = function() {
    // we could init some params here 
}

Background.prototype.setParameters = function(elapsed) {
    // we could animate something here
}

Background.prototype.sendUniformVariables = function() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,this.heightfieldTexture);
    gl.uniform1i(backgroundShader.heightfieldUniform, 0);
}

Background.prototype.draw = function() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}


Background.prototype.clear = function() {
    // clear all GPU memory
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.coordBuffer);
    gl.deleteVertexArray(this.vao);
    this.loaded = false;
}
