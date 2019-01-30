var heightfieldShader;

function initHeightfieldShader() {
    heightfieldShader = initShaders("heightfield-vs","heightfield-fs");
    
    // active ce shader
    gl.useProgram(heightfieldShader);

     // adresse de la variable uniforme uOffset dans le shader
    heightfieldShader.offsetUniform = gl.getUniformLocation(heightfieldShader, "uOffset");
    heightfieldShader.amplitudeUniform = gl.getUniformLocation(heightfieldShader, "uAmplitude");
    heightfieldShader.frequencyUniform = gl.getUniformLocation(heightfieldShader, "uFrequency");
    heightfieldShader.persistenceUniform = gl.getUniformLocation(heightfieldShader, "uPersistence");

    console.log("heightfield shader initialized");
}

function Heightfield() {
    // un tableau contenant les positions des sommets (sur CPU donc)
    var vertices = [
	-1.0,-1.0, 0.0,
	1.0,-1.0, 0.0,
	1.0, 1.0, 0.0,
	-1.0, 1.0, 0.0
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

    console.log("heightfield initialized");
}

Heightfield.prototype.initParameters = function() {
    this.timer = 0.0;
    this.offset = [0.0,0.0];
    this.amplitude = 2.0;
    this.frequency = 6.0;
    this.persistence = 0.5;
}

Heightfield.prototype.setParameters = function(elapsed) {
    // un exemple d'animation, a vous de changer ca en fonction 
    // de ce que vous souhaitez obtenir
    this.timer = this.timer+elapsed*0.0004;
    var speed = 0.5;
    this.offset[1] = this.offset[1]+elapsed*0.0004*speed;
    this.amplitude = 0.2+3.0*(Math.sin(this.offset[1]*0.5)*0.5+0.5);
}

Heightfield.prototype.shader = function() {
    return heightfieldShader;
}

Heightfield.prototype.sendUniformVariables = function() {
    gl.uniform2fv(heightfieldShader.offsetUniform,this.offset);
    gl.uniform1f(heightfieldShader.amplitudeUniform,this.amplitude);
    gl.uniform1f(heightfieldShader.frequencyUniform,this.frequency);
    gl.uniform1f(heightfieldShader.persistenceUniform,this.persistence);
}

Heightfield.prototype.draw = function() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}


Heightfield.prototype.clear = function() {
    // clear all GPU memory
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.coordBuffer);
    gl.deleteVertexArray(this.vao);
    this.loaded = false;
}
