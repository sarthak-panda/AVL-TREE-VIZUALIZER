Insert = document.getElementById('insert');
Delete = document.getElementById('delete');
Find = document.getElementById('find');
Insertbtn = document.getElementById('ibtn');
Deletebtn = document.getElementById('dbtn');
Findbtn = document.getElementById('fbtn');
var targetElement = document.querySelector('.content');
let time = 0;
var checkbox = document.getElementById('myCheckbox');
checkbox.addEventListener('change', clear);
Insert.addEventListener('input', function() {
	if(!checkbox.checked) {
		var inputValue = Insert.value;
		inputValue = inputValue.replace(/[^\d.-]/g, '');
		var hasNegativeSign = inputValue.indexOf('-') === 0;
		inputValue = inputValue.replace(/-/g, '');
		if(hasNegativeSign) {
			inputValue = '-' + inputValue;
		}
		var maxDigits = hasNegativeSign ? 10 : 9;
		var decimalIndex = inputValue.indexOf('.');
		var hasDecimalDigit = decimalIndex !== -1 && (/\d/.test(inputValue.slice(decimalIndex + 1)) || inputValue.indexOf('.', decimalIndex + 1) !== -1);
		var parts = hasDecimalDigit ? inputValue.split('.') : [inputValue];
		var integerPart = parts[0] || '0';
		var decimalPart = parts.length > 1 ? '.' + parts[1] : '';
		if(decimalIndex !== -1 && inputValue.indexOf('.', decimalIndex + 1) !== -1) {
			var secondDecimalIndex = inputValue.indexOf('.', decimalIndex + 1);
			decimalPart = '.' + inputValue.slice(decimalIndex + 1, secondDecimalIndex);
		}
		var totalLength = integerPart.length + decimalPart.length + (hasNegativeSign ? 1 : 0);
		if(totalLength > maxDigits) {
			if(decimalPart !== '') {
				var remainingDigits = maxDigits - (hasNegativeSign ? 1 : 0);
				decimalPart = decimalPart.slice(0, remainingDigits - integerPart.length);
			} else {
				integerPart = integerPart.slice(0, maxDigits - (hasNegativeSign ? 1 : 0));
			}
		}
		Insert.value = inputValue === '' ? '' : (integerPart || '0') + decimalPart;
	} else {
		var inputValue = Insert.value;
		inputValue = inputValue.slice(0, 9);
		Insert.value = inputValue === '' ? '' : inputValue;
	}
});
Insert.addEventListener('keydown', function(event) {
	if(!checkbox.checked) {
		if(event.key === 'Backspace') {
			return;
		}
		if(!/[\d.-]/.test(event.key)) {
			event.preventDefault();
		}
	} else {
		if(event.key === 'Backspace') {
			return;
		}
	}
});

function insert_helper() {
	let str = Insert.value;
	Insert.value = "";
	if(checkbox.checked) {
		avl.insert(str);
	} else {
		var num = parseFloat(str);
		avl.insert(num);
	}
}
Insert.addEventListener('keydown', (event) => {
	if(event.key === 'Enter') {
		event.preventDefault();
		document.getElementById('ibtn').disabled = 1;
		var inputValue = Insert.value;
		if(inputValue !== '' && inputValue !== '-') {
			insert_helper();
		} else {
			console.log('Input value is empty. Please enter a value.');
		}
	}
});

function delete_helper() {
	let str = Delete.value;
	Delete.value = "";
	let z;
	if(checkbox.checked) {
		z = avl.remove(str);
	} else {
		var num = parseFloat(str);
		z = avl.remove(num);
	}
	if(z === "NOT FOUND!") {
		Delete.value = "NOT FOUND!";
		setTimeout(function() {
			Delete.value = "";
		}, 1000)
	} else {
        Delete.value = "DONE!";
		setTimeout(function() {
			Delete.value = "";
		}, 1000)
    }
}
Delete.addEventListener('keydown', (event) => {
	if(event.key === 'Enter') {
		event.preventDefault();
		var inputValue = Delete.value;
		if(inputValue !== '') {
			delete_helper();
		} else {}
	}
});

function find_helper() {
	let str = Find.value;
	Find.value = "";
	let z;
	if(checkbox.checked) {
		z = avl.search(str);
	} else {
		var num = parseFloat(str);
		z = avl.search(num);
	}
	if(z === "FOUND!") {
		Find.value = "FOUND!";
		setTimeout(function() {
			Find.value = "";
		}, 5000);
	} else {
		Find.value = "NOT FOUND!";
		setTimeout(function() {
			Find.value = "";
		}, 1000);
	}
}
Find.addEventListener('keydown', (event) => {
	if(event.key === 'Enter') {
		event.preventDefault();
		var inputValue = Find.value;
		if(inputValue !== '') {
			find_helper();
		} else {
			console.log('Input value is empty. Please enter a value.');
		}
	}
});
Insertbtn.addEventListener('click', insert_helper);
Deletebtn.addEventListener('click', delete_helper);
Findbtn.addEventListener('click', find_helper);

function updateInsertButtonState() {
	var inputValue = Insert.value;
	var isDisabled = (inputValue === '' || inputValue === '-');
	document.getElementById('ibtn').disabled = isDisabled;
}
Insert.addEventListener('click', updateInsertButtonState);
Insert.addEventListener('input', updateInsertButtonState);
window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('ibtn').disabled = 1;
})
document.getElementById('ibtn').addEventListener('click', () => {
	document.getElementById('ibtn').disabled = 1;
})
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var connectors = [];

function createConnection(fromId, toId, direction) {
	var fromElement = document.getElementById(fromId);
	var toElement = document.getElementById(toId);
	if(fromElement && toElement) {
		connectors.push({
			from: fromElement,
			to: toElement,
			direction: direction
		});
		connect();
	} else {
		console.error('One or both elements not found.');
	}
}

function destroyConnection(fromId, toId) {
	connectors = connectors.filter(connector => {
		return !(connector.from.id === fromId && connector.to.id === toId);
	});
	connect();
}

function connect() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < connectors.length; i++) {
		var c = connectors[i];
		var pos1 = getElementPosition(c.from);
		var pos2 = getElementPosition(c.to);
		ctx.beginPath();
		if(c.direction === 'R') {
			ctx.moveTo(pos1.left + c.from.offsetWidth - 5, pos1.top + c.from.offsetHeight / 2);
		} else {
			ctx.moveTo(pos1.left + 5, pos1.top + c.from.offsetHeight / 2);
		}
		ctx.lineTo(pos2.left + c.to.offsetWidth / 2, pos2.top + 5);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.shadowColor = 'red';
		ctx.shadowBlur = 10;
	}
}

function getElementPosition(el) {
	var rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	};
}
window.addEventListener('resize', function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if(avl.root !== null) {
		avl.canvasResize();
	}
});

function setDraggableCursorForNodes() {
	const nodeElements = document.querySelectorAll('.node');
	nodeElements.forEach((element) => {
		element.addEventListener('mousedown', () => {
			element.style.cursor = 'grabbing';
			document.addEventListener('mouseup', () => {
				element.style.cursor = 'grab';
			}, {
				once: true
			});
		});
	});
}
let chooseElement;

const move = function(element) {
    setDraggableCursorForNodes();

    const canvas = document.querySelector("#canvas");

    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const elements = document.querySelectorAll(".node");

    const startDragging = (e) => {
        e.preventDefault();
        const currentElement = e.target.closest(".node");

        if (currentElement) {
            currentElement.style.position = "absolute";
            chooseElement = currentElement;

            const moveHandler = (e) => {
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);

                if (clientX !== undefined && clientY !== undefined) {
                    const maxX = canvasRect.right - chooseElement.clientWidth;
                    const maxY = canvasRect.bottom - chooseElement.clientHeight;

                    const restrictedX = Math.min(Math.max(clientX - 42, canvasRect.left), maxX);
                    const restrictedY = Math.min(Math.max(clientY - 30, canvasRect.top), maxY);

                    chooseElement.style.left = restrictedX + "px";
                    chooseElement.style.top = restrictedY + "px";
                    connect();
                }
            };

            const endDragging = () => {
                chooseElement = null;
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("touchmove", moveHandler);
                document.removeEventListener("mouseup", endDragging);
                document.removeEventListener("touchend", endDragging);
            };

            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("touchmove", moveHandler, { passive: false });
            document.addEventListener("mouseup", endDragging);
            document.addEventListener("touchend", endDragging);
        }
    };

    elements.forEach(element => {
        element.addEventListener("mousedown", startDragging);
        element.addEventListener("touchstart", startDragging, { passive: false });
    });
};
class BinaryTreeNode {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.parent = null;
		this.height = 0;
		this.id = 0;
	}
	LeftLeftRotation() {
		const y = this.right;
		const T2 = y.left;
		let p = 0;
		if(this.parent !== null) {
			if(this.parent.left === this) {
				this.parent.left = y;
				createConnection(this.parent.id, y.id, 'L');
			} else {
				this.parent.right = y;
				createConnection(this.parent.id, y.id, 'R');
			}
		}
		y.parent = this.parent;
		if(this.parent !== null) {
			destroyConnection(this.parent.id, this.id);
		}
		y.left = this;
		destroyConnection(this.id, y.id);
		createConnection(y.id, this.id, 'L');
		this.parent = y;
		if(T2 !== null) {
			destroyConnection(y.id, T2.id);
		}
		this.right = T2;
		if(T2 !== null) {
			createConnection(this.id, T2.id, 'R');
		}
		if(T2 !== null) {
			T2.parent = this;
		}
		let h1 = (this.left !== null) ? this.left.height : -1;
		let h2 = (T2 !== null) ? T2.height : -1;
		let h3 = (y.right !== null) ? y.right.height : -1;
		this.height = Math.max(h1, h2) + 1;
		y.height = Math.max(this.height, h3) + 1;
		return y;
	}
	RightRightRotation() {
		const y = this.left;
		const T3 = y.right;
		if(this.parent !== null) {
			if(this.parent.left === this) {
				this.parent.left = y;
				createConnection(this.parent.id, y.id, 'L');
			} else {
				this.parent.right = y;
				createConnection(this.parent.id, y.id, 'R');
			}
		}
		y.parent = this.parent;
		if(this.parent !== null) {
			destroyConnection(this.parent.id, this.id);
		}
		y.right = this;
		destroyConnection(this.id, y.id);
		createConnection(y.id, this.id, 'R');
		this.parent = y;
		if(T3 !== null) {
			destroyConnection(y.id, T3.id);
		}
		this.left = T3;
		if(T3 !== null) {
			createConnection(this.id, T3.id, 'L');
		}
		let h1 = (this.right !== null) ? this.right.height : -1;
		let h2, h3;
		if(T3 !== null) {
			T3.parent = this;
			h2 = T3.height;
		} else {
			h2 = -1;
		}
		if(y.left !== null) {
			h3 = y.left.height;
		} else {
			h3 = -1;
		}
		this.height = Math.max(h1, h2) + 1;
		y.height = Math.max(this.height, h3) + 1;
		return y;
	}
	LeftRightRotation() {
		const y = this.right;
		const x = y.left;
		const T2 = x.left;
		const T3 = x.right;
		if(this.parent !== null) {
			if(this.parent.left === this) {
				this.parent.left = x;
				createConnection(this.parent.id, x.id, 'L');
			} else {
				this.parent.right = x;
				createConnection(this.parent.id, x.id, 'R');
			}
		}
		destroyConnection(y.id, x.id);
		x.parent = this.parent;
		if(this.parent !== null) {
			destroyConnection(this.parent.id, this.id);
		}
		x.left = this;
		if(T2 !== null) {
			destroyConnection(x.id, T2.id);
		}
		createConnection(x.id, this.id, 'L');
		this.parent = x;
		destroyConnection(this.id, y.id);
		x.right = y;
		if(T3 !== null) {
			destroyConnection(x.id, T3.id);
		}
		createConnection(x.id, y.id, 'R');
		y.parent = x;
		this.right = T2;
		if(T2 !== null) {
			createConnection(this.id, T2.id, 'R');
		}
		y.left = T3;
		if(T3 !== null) {
			createConnection(y.id, T3.id, 'L');
		}
		let h1 = (this.left !== null) ? this.left.height : -1;
		let h2, h3, h4;
		if(T2 !== null) {
			T2.parent = this;
			h2 = T2.height;
		} else {
			h2 = -1;
		}
		if(T3 !== null) {
			T3.parent = y;
			h3 = T3.height;
		} else {
			h3 = -1;
		}
		if(y.right !== null) {
			h4 = y.right.height;
		} else {
			h4 = -1;
		}
		this.height = Math.max(h1, h2) + 1;
		y.height = Math.max(h3, h4) + 1;
		x.height = Math.max(y.height, this.height) + 1;
		return x;
	}
	RightLeftRotation() {
		const y = this.left;
		const x = y.right;
		const T2 = x.left;
		const T3 = x.right;
		if(this.parent !== null) {
			if(this.parent.left === this) {
				this.parent.left = x;
				createConnection(this.parent.id, x.id, 'L');
			} else {
				this.parent.right = x;
				createConnection(this.parent.id, x.id, 'R');
			}
		}
		destroyConnection(y.id, x.id);
		x.parent = this.parent;
		if(this.parent !== null) {
			destroyConnection(this.parent.id, this.id);
		}
		x.left = y;
		if(T2 !== null) {
			destroyConnection(x.id, T2.id);
		}
		createConnection(x.id, y.id, 'L');
		y.parent = x;
		destroyConnection(this.id, y.id);
		x.right = this;
		if(T3 !== null) {
			destroyConnection(x.id, T3.id);
		}
		createConnection(x.id, this.id, 'R');
		this.parent = x;
		this.left = T3;
		if(T3 !== null) {
			createConnection(this.id, T3.id, 'L');
		}
		y.right = T2;
		if(T2 !== null) {
			createConnection(y.id, T2.id, 'R');
		}
		let h1, h2, h3, h4;
		if(y.left !== null) {
			h1 = y.left.height;
		} else {
			h1 = -1;
		}
		if(T2 !== null) {
			T2.parent = y;
			h2 = T2.height;
		} else {
			h2 = -1;
		}
		if(T3 !== null) {
			T3.parent = this;
			h3 = T3.height;
		} else {
			h3 = -1;
		}
		if(this.right !== null) {
			h4 = this.right.height;
		} else {
			h4 = -1;
		}
		this.height = Math.max(h3, h4) + 1;
		y.height = Math.max(h1, h2) + 1;
		x.height = Math.max(y.height, this.height) + 1;
		return x;
	}
}

function Status(n) {
	let h1, h2;
	let s;
	if(n.left !== null) {
		h1 = n.left.height;
	} else {
		h1 = -1;
	}
	if(n.right !== null) {
		h2 = n.right.height;
	} else {
		h2 = -1;
	}
	if(h1 === h2) {
		s = "PB";
	} else if(h1 - h2 === 1) {
		s = "LH";
	} else if(h2 - h1 === 1) {
		s = "RH";
	} else if(h1 - h2 === 2) {
		s = "LIB";
	} else if(h2 - h1 === 2) {
		s = "RIB";
	}
	return s;
}

function changeBoxShadow(objectId, color) {
	var element = document.getElementById(objectId);
	if(element) {
		element.style.boxShadow = `0 0 15px ${color}`;
	} else {
		console.error('Element with ID ' + objectId + ' not found.');
	}
}

function changeTextColor(objectId, textColor) {
	var element = document.getElementById(objectId);
	if(element) {
		element.style.color = textColor;
	} else {
		console.error('Element with ID ' + objectId + ' not found.');
	}
}

function createBlinkingEffect(objectId) {
	var redColor = 'red';
	var blueColor = 'blue';
	var isRed = true;
	var blinkingInterval = setInterval(function() {
		if(isRed) {
			changeBoxShadow(objectId, blueColor);
			changeTextColor(objectId, 'white');
		} else {
			changeBoxShadow(objectId, redColor);
			changeTextColor(objectId, 'hotpink');
		}
		isRed = !isRed;
	}, 500);
	setTimeout(function() {
		clearInterval(blinkingInterval);
		changeBoxShadow(objectId, 'gold');
		changeTextColor(objectId, 'greenyellow');
	}, 5000);
}

function destroyNode(elementId) {
	var elementToRemove = document.getElementById(elementId);
	if(elementToRemove) {
		var contentElement = document.querySelector('.content');
		if(contentElement.contains(elementToRemove)) {
			contentElement.removeChild(elementToRemove);
		} else {
			console.error('Element with ID ' + elementId + ' is not a child of .content.');
		}
	} else {
		console.error('Element with ID ' + elementId + ' not found.');
	}
}

function exchangeElementIds(elementId1, elementId2) {
	var element1 = document.getElementById(elementId1);
	var element2 = document.getElementById(elementId2);
	if(element1 && element2) {
		var tempId = element1.id;
		element1.id = element2.id;
		element2.id = tempId;
	} else {
		console.error('One or both elements not found.');
	}
}
class Tree {
	constructor() {
		this.size = 0;
		this.root = null;
	}
	positionY() {
		let q = [];
		let depth = -1;
		let nodeCount = 0;
		let currentNode;
		const totalHeight = canvas.height - 150;
		let verticalSpacing = Number.MAX_VALUE;
		if(this.root !== null) {
			verticalSpacing = totalHeight / (this.root.height + 1);
		}
		if(this.root === null) {
			return verticalSpacing;
		}
		q.push(this.root);
		while(q.length > 0) {
			depth++;
			nodeCount = q.length;
			while(nodeCount > 0) {
				currentNode = q[0];
				const element = document.getElementById(currentNode.id);
				if(depth == 0) {
					const verticalPosition = 100;
					element.style.top = verticalPosition + "px";
				} else {
					const verticalPosition = 100 + depth * verticalSpacing;
					element.style.top = verticalPosition + "px";
				}
				if(currentNode.left !== null) {
					q.push(currentNode.left);
				}
				if(currentNode.right !== null) {
					q.push(currentNode.right);
				}
				q.shift();
				nodeCount--;
			}
		}
		return verticalSpacing;
	}
	positionX() {
		const stack = [];
		let curr = this.root;
		let gap = canvas.width / (this.size + 1);
		let i = 1;
		while(curr !== null || stack.length > 0) {
			while(curr !== null) {
				stack.push(curr);
				curr = curr.left;
			}
			curr = stack.pop();
			const element = document.getElementById(curr.id);
			element.style.left = i * gap + "px";
			i++;
			curr = curr.right;
		}
		return(i - 1) * gap;
	}
	insert(value) {
		const node = new BinaryTreeNode(value);
		node.id = "a" + time;
		var desiredHTML = `<div id=${"a"+time} class="node">${value}</div>`;
		targetElement.insertAdjacentHTML('beforeend', desiredHTML);
		time++;
		if(this.root === null) {
			this.size = 0;
			this.root = node;
		} else {
			let temp = this.root;
			let temppar = this.root;
			let temp2 = null;
			let z;
			let o = 0;
			while(temp !== null) {
				if(value > temp.value) {
					temppar = temp;
					temp = temp.right;
				} else {
					temppar = temp;
					temp = temp.left;
				}
			}
			if(value > temppar.value) {
				temppar.right = node;
				node.parent = temppar;
				createConnection(temppar.id, node.id, 'R');
			} else {
				temppar.left = node;
				node.parent = temppar;
				createConnection(temppar.id, node.id, 'L');
			}
			temp2 = node.parent;
			while(temp2 !== null) {
				let h1 = (temp2.left !== null) ? temp2.left.height : -1;
				let h2 = (temp2.right !== null) ? temp2.right.height : -1;
				temp2.height = Math.max(h1, h2) + 1;
				if(Status(temp2) === "LIB") {
					if(temp2.left !== null && Status(temp2.left) === "RH") {
						z = temp2.RightLeftRotation();
						if(z.parent === null) {
							this.root = z;
						}
					} else {
						z = temp2.RightRightRotation();
						if(z.parent === null) {
							this.root = z;
						}
					}
				} else if(Status(temp2) === "RIB") {
					if(temp2.right !== null && Status(temp2.right) === "LH") {
						z = temp2.LeftRightRotation();
						if(z.parent === null) {
							this.root = z;
						}
					} else {
						z = temp2.LeftLeftRotation();
						if(z.parent === null) {
							this.root = z;
						}
					}
				}
				temp2 = temp2.parent;
			}
		}
		this.size++;
		this.canvasResize();
	}
	remove(k) {
		let temp = this.root;
		let temppar = this.root;
		let temp2 = null;
		let z;
		while(temp !== null && temp.value !== k) {
			if(k > temp.value) {
				temppar = temp;
				temp = temp.right;
			} else {
				temppar = temp;
				temp = temp.left;
			}
		}
		if(temp === null) {
			return "NOT FOUND!";
		}
		this.size--;
		if(this.size === 0) {
			destroyNode(this.root.id);
			this.root.left = null;
			this.root.right = null;
			this.root = null;
			return "done";
		}
		if(temp.left === null && temp.right === null) {
			if(temppar.left === temp) {
				destroyConnection(temppar.id, temp.id);
				temppar.left = null;
				destroyNode(temp.id);
			} else {
				destroyConnection(temppar.id, temp.id);
				temppar.right = null;
				destroyNode(temp.id);
			}
			temp2 = temppar;
			temp.left = null;
			temp.right = null;
		} else if((temp.left === null && temp.right !== null) || (temp.left !== null && temp.right === null)) {
			if(temp === this.root) {
				if(temp.left !== null) {
					destroyConnection(temp.id, temp.left.id);
					destroyNode(temp.id);
				} else {
					destroyConnection(temp.id, temp.right.id);
					destroyNode(temp.id);
				}
				this.root = (temp.left !== null) ? temp.left : temp.right;
				this.root.parent = null;
			} else {
				if(temppar.right === temp) {
					destroyConnection(temppar.id, temp.id);
					if(temp.left !== null) {
						destroyConnection(temp.id, temp.left.id);
						destroyNode(temp.id);
						createConnection(temppar.id, temp.left.id, 'R');
						temppar.right = temp.left;
						temp.left.parent = temppar;
					} else {
						destroyConnection(temp.id, temp.right.id);
						destroyNode(temp.id);
						createConnection(temppar.id, temp.right.id, 'R');
						temppar.right = temp.right;
						temp.right.parent = temppar;
					}
				} else {
					destroyConnection(temppar.id, temp.id);
					if(temp.left !== null) {
						destroyConnection(temp.id, temp.left.id);
						destroyNode(temp.id);
						createConnection(temppar.id, temp.left.id, 'L');
						temppar.left = temp.left;
						temp.left.parent = temppar;
					} else {
						destroyConnection(temp.id, temp.right.id);
						destroyNode(temp.id);
						createConnection(temppar.id, temp.right.id, 'L');
						temppar.left = temp.right;
						temp.right.parent = temppar;
					}
				}
				temp2 = temppar;
			}
			temp.left = null;
			temp.right = null;
		} else {
			let s, spar;
			spar = temp;
			s = temp.right;
			while(s.left !== null) {
				spar = s;
				s = s.left;
			}
			let tempnode = document.getElementById(temp.id);
			tempnode.innerHTML = s.value;
			let snode = document.getElementById(s.id);
			snode.innerHTML = temp.value;
			temp.value = s.value;
			if(spar.id === temp.id) {
				destroyConnection(spar.id, s.id);
				spar.right = s.right;
				destroyNode(s.id);
				if(s.right !== null) {
					destroyConnection(s.id, s.right.id);
					s.right.parent = spar;
					createConnection(spar.id, s.right.id, 'R');
				}
			} else {
				destroyConnection(spar.id, s.id);
				if(s.right === null) {
					destroyNode(s.id);
					spar.left = null;
				} else {
					destroyConnection(s.id, s.right.id);
					destroyNode(s.id);
					spar.left = s.right;
					s.right.parent = spar;
					createConnection(spar.id, s.right.id, 'L');
				}
			}
			temp2 = spar;
			s.left = null;
			s.right = null;
		}
		while(temp2 !== null) {
			let h1 = (temp2.left !== null) ? temp2.left.height : -1;
			let h2 = (temp2.right !== null) ? temp2.right.height : -1;
			temp2.height = Math.max(h1, h2) + 1;
			if(Status(temp2) === "LIB") {
				if(temp2.left !== null && Status(temp2.left) === "RH") {
					z = temp2.RightLeftRotation();
					if(z.parent === null) {
						this.root = z;
					}
				} else {
					z = temp2.RightRightRotation();
					if(z.parent === null) {
						this.root = z;
					}
				}
			} else if(Status(temp2) === "RIB") {
				if(temp2.right !== null && Status(temp2.right) === "LH") {
					z = temp2.LeftRightRotation();
					if(z.parent === null) {
						this.root = z;
					}
				} else {
					z = temp2.LeftLeftRotation();
					if(z.parent === null) {
						this.root = z;
					}
				}
			}
			temp2 = temp2.parent;
		}
		this.canvasResize();
		return "done";
	}
	search(k) {
		let temp = this.root;
		while(temp !== null && temp.value !== k) {
			if(k > temp.value) {
				temp = temp.right;
			} else {
				temp = temp.left;
			}
		}
		if(temp === null) {
			return "NOT FOUND!";
		}
		createBlinkingEffect(temp.id);
		return "FOUND!";
	}
	canvasResize() {
		let r = this.positionX();
		let g = this.positionY();
		let sn = document.querySelector(".node");
		if(r + sn.clientWidth >= canvas.width) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = 2 * canvas.width;
		} else if(r + sn.clientWidth < canvas.width && canvas.width > window.innerWidth) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = canvas.width / 2;
			r = this.positionX();
			if(r + sn.clientWidth >= canvas.width) {
				canvas.width = 2 * canvas.width;
			}
		}
		if(g <= sn.clientHeight / 2) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.height = 2 * canvas.height;
		} else if(g > sn.clientHeight / 2 && canvas.height > window.innerHeight) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.height = canvas.height / 2;
			g = this.positionY();
			if(g <= sn.clientHeight / 2) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				canvas.height = 2 * canvas.height;
			}
		}
		this.positionX();
		this.positionY();
		move('element');
		connect();
	}
}
let avl = new Tree();

function clear() {
	targetElement.innerHTML = '';
	connectors = [];
	connect();
	avl = new Tree();
	time = 0;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	Insert.value = "";
	Delete.value = "";
	Find.value = "";
	document.getElementById("ibtn").disabled = 1;
}
document.getElementById('resetButton').addEventListener('click', clear);

function resetPosition() {
	avl.positionY();
	avl.positionX();
	connect();
}
document.getElementById('resetPositionButton').addEventListener('click', resetPosition);

function removeDynamicScript(filename) {
	var targetelement = "script";
	var targetattr = "src";
	var allsuspects = document.getElementsByTagName(targetelement);
	for(var i = allsuspects.length - 1; i >= 0; i--) {
		if(allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
		}
	}
}
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById("instructionsButton").addEventListener('click', () => {
		let inst = document.querySelector(".instructions");
		let loaded = document.querySelector(".loaded");
		inst.style.display = 'block';
		loaded.style.display = "none";
		var canvas1 = document.querySelector('#canvas1')
		var c1 = canvas1.getContext('2d')
		canvas1.width = innerWidth
		canvas1.height = innerHeight

		function resizeCanvas() {
			canvas1.width = window.innerWidth;
			canvas1.height = window.innerHeight;
			init();
		}
		let mouseDown = false
		addEventListener('mousedown', () => {
			mouseDown = true;
		})
		addEventListener('mouseup', () => {
			mouseDown = false;
		})
		window.addEventListener('resize', resizeCanvas);
		const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', 'gold', 'greenyellow', 'purple']
		class Particle {
			constructor(x, y, radius, color) {
				this.x = x
				this.y = y
				this.radius = radius
				this.color = color
			}
			draw() {
				c1.beginPath()
				c1.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
				c1.shadowColor = this.color
				c1.shadowBlur = 15
				c1.fillStyle = this.color
				c1.fill()
				c1.closePath()
			}
			update() {
				this.draw()
			}
		}
		let particles

		function init() {
			particles = []
			for(let i = 0; i < 750; i++) {
				const canvasWidth = canvas1.width + 1000
				const canvasHeight = canvas1.height + 1000
				const x = (Math.random() * canvasWidth) - canvasWidth / 2;
				const y = Math.random() * canvasHeight - canvasHeight / 2;
				const radius = 2 * Math.random();
				const color = colors[Math.floor(Math.random() * colors.length)]
				particles.push(new Particle(x, y, radius, color));
			}
		}
		let radians = 0;
		let alpha = 1;

		function animate() {
			requestAnimationFrame(animate)
			c1.fillStyle = `rgba(10,10,10,${alpha})`
			c1.fillRect(0, 0, canvas1.width, canvas1.height)
			c1.save()
			c1.translate(canvas1.width / 2, canvas1.height / 2)
			c1.rotate(radians)
			particles.forEach((particle) => {
				particle.update()
			})
			c1.restore()
			radians += 0.004
			if(mouseDown && alpha >= 0.03) {
				alpha -= 0.01
			} else if(!mouseDown && alpha < 1) {
				alpha += 0.01
			}
		}
		init()
		animate()
	});
	document.getElementById("return").addEventListener('click', () => {
		let inst = document.querySelector(".instructions");
		let loaded = document.querySelector(".loaded");
		inst.style.display = "none";
		loaded.style.display = "block";
	});
});
