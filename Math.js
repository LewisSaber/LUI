//import SimpleDataFrame from "./SimpleDataFrame.js"
import { mergeObject } from "./Utility.js"

export class Line {
  constructor(a = new Vector(), b = new Vector()) {
    this.start = a
    this.end = b
  }
  getLength() {
    return Math.sqrt(
      this.getHorizontalLength() ** 2 + this.getVerticalLength() ** 2
    )
  }

  getHorizontalLength() {
    return Math.abs(this.start.x - this.end.x)
  }
  getVerticalLength() {
    return Math.abs(this.start.y - this.end.y)
  }

  addVec(vec) {
    return new Line(this.start.add_vec(vec), this.end.add_vec(vec))
  }
  splitAtX(x) {
    let k = (this.start.y - this.end.y) / (this.start.x - this.end.x)
    let b = this.start.y - k * this.start.x
    let y = k * x + b
    if (this.start.x < this.end.x)
      return {
        left: new Line(
          new Vector(this.start.x, +this.start.y.toFixed(2)),
          new Vector(x, +y.toFixed(2))
        ),
        right: new Line(new Vector(x, y), new Vector(this.end.x, this.end.y)),
      }
    return {
      left: new Line(new Vector(this.end.x, this.end.y), new Vector(x, y)),
      right: new Line(new Vector(x, y), new Vector(this.start.x, this.start.y)),
    }
  }

  toString() {
    return `Line: ${this.start.toStringFixed(2)} -> ${this.end.toStringFixed(
      2
    )}`
  }
}

export class Vector {
  constructor(x = 0.0, y = 0.0) {
    this.x = x
    this.y = y
  }
  shiftInPlace() {
    this.x >>= 0
    this.y >>= 0
    return this
  }
  scale(factor) {
    let result = new Vector(this.x, this.y)
    result.x *= factor
    result.y *= factor
    return result
  }
  add_vec(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
  sub_vec(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }
  div_vec(vector) {
    return new Vector(this.x / vector.x, this.y / vector.y)
  }
  vectorize() {
    let distance =
      this.x && this.y ? Math.abs(this.x / 2) + Math.abs(this.y / 2) : 0
    let hipon = (this.x ** 2 + this.y ** 2) ** 0.5
    let scale = distance / hipon || 1

    return new Vector(this.x * scale, this.y * scale)
  }
  multiply(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y)
  }
  hasZeroAxis() {
    return this.x == 0 || this.y == 0
  }
  isZero() {
    return this.x == 0 && this.y == 0
  }
  toString() {
    return `(${this.x}, ${this.y})`
  }
  toStringFixed(fixed = 2) {
    return `(${+this.x.toFixed(fixed)}, ${+this.y.toFixed(fixed)})`
  }
  copy() {
    return new Vector(this.x, this.y)
  }
  min() {
    return this.x < this.y ? this.x : this.y
  }
  max() {
    return this.x > this.y ? this.x : this.y
  }
  has(number) {
    return this.x == number || this.y == number
  }
  static parseString(str, sep = ",") {
    let values = str
      .replaceAll("\n", sep)
      .split(sep)
      .map((value) => Number(value.trim()))
    return new Vector(values[0], values[1]).shiftInPlace()
  }

  reverse() {
    return new Vector(this.y, this.x)
  }
  average() {
    return (this.x + this.y) / 2
  }
}

export class Vector4d {
  constructor(x = 0.0, y = 0.0, z = 0.0, a = 0.0) {
    this.x = x
    this.y = y
    this.z = z
    this.a = a
  }
  shiftInPlace() {
    this.x >>= 0
    this.y >>= 0
    this.z >>= 0
    this.a >>= 0
    return this
  }
  scale(factor) {
    let result = this.copy()
    result.x *= factor
    result.y *= factor
    result.a *= factor
    result.z *= factor
    return result
  }
  add_vec(vector) {
    return new Vector4d(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z,
      this.a + vector.a
    )
  }
  sub_vec(vector) {
    return new Vector4d(
      this.y - vector.y,
      this.z - vector.z,
      this.x - vector.x,
      this.a - vector.a
    )
  }
  div_vec(vector) {
    return new Vector4d(
      this.x / vector.x,
      this.y / vector.y,
      this.z / vector.z,
      this.a / vector.a
    )
  }

  multiply(vector) {
    return new Vector4d(
      this.x * vector.x,
      this.y * vector.y,
      this.z * vector.z,
      this.a * vector.a
    )
  }
  hasZeroAxis() {
    return this.x == 0 || this.y == 0 || (this.a == 0) | (this.z == 0)
  }
  isZero() {
    return this.x == 0 && this.y == 0 && this.a == 0 && this.z == 0
  }
  toString() {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.a})`
  }
  toStringFixed(fixed = 2) {
    return `(${+this.x.toFixed(fixed)}, ${+this.y.toFixed(
      fixed
    )}), ${+this.z.toFixed(fixed)}), ${+this.a.toFixed(fixed)})`
  }
  copy() {
    return new Vector4d(this.x, this.y, this.z, this.a)
  }
  min() {
    let min = this.x < this.y ? this.x : this.y
    min = min < this.z ? min : this.z
    min = min < this.a ? min : this.a
    return min
  }
  max() {
    let max = this.x > this.y ? this.x : this.y
    max = max > this.z ? max : this.z
    max = max > this.a ? max : this.a
    return max
  }
  has(number) {
    return (
      this.x == number ||
      this.y == number ||
      this.z == number ||
      this.a == number
    )
  }
}

export class M3x3 {
  constructor() {
    this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }
  multiply(m) {
    var output = new M3x3()
    output.matrix = [
      this.matrix[M3x3.M00] * m.matrix[M3x3.M00] +
        this.matrix[M3x3.M10] * m.matrix[M3x3.M01] +
        this.matrix[M3x3.M20] * m.matrix[M3x3.M02],
      this.matrix[M3x3.M01] * m.matrix[M3x3.M00] +
        this.matrix[M3x3.M11] * m.matrix[M3x3.M01] +
        this.matrix[M3x3.M21] * m.matrix[M3x3.M02],
      this.matrix[M3x3.M02] * m.matrix[M3x3.M00] +
        this.matrix[M3x3.M12] * m.matrix[M3x3.M01] +
        this.matrix[M3x3.M22] * m.matrix[M3x3.M02],

      this.matrix[M3x3.M00] * m.matrix[M3x3.M10] +
        this.matrix[M3x3.M10] * m.matrix[M3x3.M11] +
        this.matrix[M3x3.M20] * m.matrix[M3x3.M12],
      this.matrix[M3x3.M01] * m.matrix[M3x3.M10] +
        this.matrix[M3x3.M11] * m.matrix[M3x3.M11] +
        this.matrix[M3x3.M21] * m.matrix[M3x3.M12],
      this.matrix[M3x3.M02] * m.matrix[M3x3.M10] +
        this.matrix[M3x3.M12] * m.matrix[M3x3.M11] +
        this.matrix[M3x3.M22] * m.matrix[M3x3.M12],

      this.matrix[M3x3.M00] * m.matrix[M3x3.M20] +
        this.matrix[M3x3.M10] * m.matrix[M3x3.M21] +
        this.matrix[M3x3.M20] * m.matrix[M3x3.M22],
      this.matrix[M3x3.M01] * m.matrix[M3x3.M20] +
        this.matrix[M3x3.M11] * m.matrix[M3x3.M21] +
        this.matrix[M3x3.M21] * m.matrix[M3x3.M22],
      this.matrix[M3x3.M02] * m.matrix[M3x3.M20] +
        this.matrix[M3x3.M12] * m.matrix[M3x3.M21] +
        this.matrix[M3x3.M22] * m.matrix[M3x3.M22],
    ]
    return output
  }
  transition(x, y) {
    var output = new M3x3()
    output.matrix = [
      this.matrix[M3x3.M00],
      this.matrix[M3x3.M01],
      this.matrix[M3x3.M02],

      this.matrix[M3x3.M10],
      this.matrix[M3x3.M11],
      this.matrix[M3x3.M12],

      x * this.matrix[M3x3.M00] +
        y * this.matrix[M3x3.M10] +
        this.matrix[M3x3.M20],
      x * this.matrix[M3x3.M01] +
        y * this.matrix[M3x3.M11] +
        this.matrix[M3x3.M21],
      x * this.matrix[M3x3.M02] +
        y * this.matrix[M3x3.M12] +
        this.matrix[M3x3.M22],
    ]
    return output
  }
  scale(x, y) {
    var output = new M3x3()
    output.matrix = [
      this.matrix[M3x3.M00] * x,
      this.matrix[M3x3.M01] * x,
      this.matrix[M3x3.M02] * x,

      this.matrix[M3x3.M10] * y,
      this.matrix[M3x3.M11] * y,
      this.matrix[M3x3.M12] * y,

      this.matrix[M3x3.M20],
      this.matrix[M3x3.M21],
      this.matrix[M3x3.M22],
    ]
    return output
  }
  getFloatArray() {
    return new Float32Array(this.matrix)
  }
}
M3x3.M00 = 0
M3x3.M01 = 1
M3x3.M02 = 2
M3x3.M10 = 3
M3x3.M11 = 4
M3x3.M12 = 5
M3x3.M20 = 6
M3x3.M21 = 7
M3x3.M22 = 8

export class Matrix {
  constructor(size) {
    this.matrix = []
    this.resizeMatrix(size)
  }
  getSize() {
    return new Vector(this.matrix.get(0, []).length, this.matrix.length)
  }
  resizeMatrix(size) {
    this.matrix.length = size.y
    for (let i = 0; i < size.y; i++) {
      if (this.matrix[i] == undefined) this.matrix[i] = []
      for (let j = 0; j < size.x; j++) {
        this.matrix[i][j] = this.matrix[i].get(j, 0)
      }
      this.matrix[i].length = size.x
    }
    if (this.df) this.toDataFrame()
    return this
  }
  toDataFrame() {
    if (this.df == undefined) {
      this.df = new SimpleDataFrame()
      this.df.setFontSize(0.5)
      this.df.loadOptions({
        isVertical: true,
        showRowNames: false,
        allowEditing: true,
      })
      this.df.addEventListener("valueChange", ({ newValue, at }) => {
        this.matrix[at.x][at.y] = newValue
      })
    }
    let size = this.getSize()
    this.df.clearAll()
    this.df.getTable() //.setSize(size.sub_vec(new Vector(0.5)))
    for (let j = 0; j < size.x; j++) {
      let column = []
      for (let i = 0; i < size.y; i++) {
        column[i] = this.matrix[i][j]
      }
      this.df.addColumn(j, column)
    }
    this.df.refreshTable()
    return this.df
  }
  fromTXT(str) {
    const numRows = str.split("\n").length

    const values = str
      .replaceAll("\n", ",")
      .split(",")
      .map((value) => Number(value.trim()))
    const numCols = (values.length / numRows) >> 0
    // Determine the number of rows and columns based on the length of the array

    this.resizeMatrix(new Vector(numCols, numRows))

    // Populate the matrix with the values from the array
    let index = 0
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        this.matrix[i][j] = values[index]
        index++
      }
    }
    if (this.df) this.toDataFrame()
  }
  copy() {
    const size = this.getSize()
    const result = new Matrix(size)
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        result.matrix[i][j] = this.matrix[i][j]
      }
    }
    return result
  }
  getTrangleMatrix(transformations) {
    const result = this.copy()
    const size = this.getSize()
    let transformationsDone = new Matrix(new Vector(size.y - 1, size.y - 1))
    for (let t = 0; t < size.y - 1; t++) {
      for (let k = 1; k < size.y - t; k++) {
        let multiplier
        if (transformations) multiplier = transformations.get(t, t + k - 1)
        else multiplier = result.matrix[t + k][t] / result.matrix[t][t]
        transformationsDone.set(t, t + k - 1, multiplier)
        if (multiplier == 0) continue
        // result.multiplyRow(1 / multiplier, t + k).substractRow(t, t + k)
        let firstRow = result.getRow(t, true)
        this.multiplyRow(multiplier, firstRow)
        result.substractRow(firstRow, t + k)
      }
      // console.log(result.toString())
    }
    result.transformations = transformationsDone
    return result
  }
  multiplyRow(value, row) {
    const size = this.getSize()

    if (!Array.isArray(row)) {
      row = this.getRow(row, false)
    }
    for (let j = 0; j < size.x; j++) {
      row[j] *= value
      row[j] = +row[j].toFixed(3)
    }
    return this
  }
  substractRow(row, fromRowIndex) {
    if (!Array.isArray(row)) row = this.getRow(row)
    const size = this.getSize()
    for (let j = 0; j < size.x; j++) {
      this.matrix[fromRowIndex][j] -= row[j]
      this.matrix[fromRowIndex][j] = +this.matrix[fromRowIndex][j].toFixed(3)
    }
  }
  getRow(index, copy = true) {
    let row = this.matrix[index]
    if (copy) {
      let result = []
      for (let i = 0; i < row.length; i++) {
        result[i] = row[i]
      }
      return result
    }
    return row
  }
  getColumn(index) {
    const size = this.getSize()
    let result = []
    for (let i = 0; i < size.y; i++) {
      result[i] = this.matrix[i][index]
    }

    return result
  }
  toString() {
    const size = this.getSize()
    let result = ""
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        result += this.matrix[i][j] + ", "
      }
      result += "\n"
    }
    return result
  }
  solve(solutionRow) {
    const size = this.getSize()
    if (size.x - size.y == 1 || solutionRow != undefined) {
      let triangleMatrix = this.getTrangleMatrix()
      if (solutionRow == undefined)
        solutionRow = triangleMatrix.getColumn(size.y)
      size.x = size.y
      triangleMatrix.resizeMatrix(size)
      let solution = []
      //amount of x
      for (let s = size.x - 1; s >= 0; s--) {
        let sum = 0
        for (let i = s + 1; i < size.x; i++) {
          sum += triangleMatrix.matrix[s][i] * solution[i]
        }
        solution[s] = +(
          (solutionRow[s] - sum) /
          triangleMatrix.matrix[s][s]
        ).toFixed(3)
        if (
          solution[s] == -Infinity ||
          solution[s] == Infinity ||
          isNaN(solution[s])
        )
          return Matrix.fromArray(["Cant Solve"])
      }
      return Matrix.fromArray(solution)
    } else
      console.error(
        "Cant solve, matrix should have width-height = 1, instead got",
        size.x - size.y
      )
  }
  set(i, j, value) {
    this.matrix[i][j] = value
  }
  get(i, j) {
    return this.matrix[i][j]
  }
  inverse() {
    let triangleMatrix = this.getTrangleMatrix()
    const size = triangleMatrix.getSize()
    let indentityMatrix = Matrix.identity(size.y)

    indentityMatrix = indentityMatrix.getTrangleMatrix(
      triangleMatrix.transformations
    )

    let inversedMatrix = new Matrix(new Vector(size.y, size.y))

    for (let j = 0; j < size.y; j++) {
      let column = triangleMatrix.solve(indentityMatrix.getColumn(j))
      if (column.get(0, 0) == "Cant Solve") return column
      for (let i = 0; i < column.getSize().x; i++) {
        inversedMatrix.set(i, j, +column.get(0, i).toFixed(2))
      }
    }
    return inversedMatrix
  }

  static identity(size) {
    let result = new Matrix(new Vector(size, size))
    for (let i = 0; i < size; i++) {
      result.matrix[i][i] = 1
    }
    return result
  }
  static fromArray(array) {
    if (Array.isArray(array[0])) {
    } else {
      let result = new Matrix(new Vector(array.length, 1))
      for (let i = 0; i < array.length; i++) {
        result.set(0, i, array[i])
      }
      return result
    }
  }
  transpose() {
    const size = this.getSize()
    let result = new Matrix(size.reverse())
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        result.set(j, i, this.get(i, j))
      }
    }
    return result
  }
  UTU() {
    let size = this.getSize()

    if (size.x != size.y)
      return {
        U: Matrix.fromArray(["Cant Solve"]),
        UT: Matrix.fromArray(["Cant Solve"]),
      }

    let Umatrix = new Matrix(size)
    for (let i = 0; i < size.y; i++) {
      for (let j = i; j < size.x; j++) {
        let element
        if (j == 0) {
          if (i == j) {
            element = Math.sqrt(this.get(0, 0))
          } else {
            element = this.get(i, j) / Umatrix.get(0, 0)
          }
        } else if (i == j) {
          let sum = 0
          for (let k = 0; k < i; k++) {
            sum += Umatrix.get(k, i) ** 2
          }
          element = Math.sqrt(this.get(i, j) - sum)
        } else {
          let sum = 0
          for (let k = 0; k < i; k++) {
            sum += Umatrix.get(k, i) * Umatrix.get(k, j)
          }
          element = (this.get(i, j) - sum) / Umatrix.get(i, i)
        }

        Umatrix.set(i, j, +element.toFixed(3))
      }
    }
    if (Umatrix.hasNaN()) {
      Umatrix = Matrix.fromArray(["Cant Solve"])
    }
    return {
      U: Umatrix,
      UT: Umatrix.transpose(),
    }
  }
  solveWithUTU() {
    let size = this.getSize()
    if (size.y == size.x || size.x - 1 > size.y)
      return mergeObject(this.UTU(), {
        solution: Matrix.fromArray(["Cant Solve"]),
      })
    let x = Matrix.fromArray(this.getColumn(size.y))

    let matrixes = this.copy().resizeMatrix(new Vector(size.y, size.y)).UTU()
    if (matrixes.U.get(0, 0) == "Cant Solve")
      return mergeObject(matrixes, {
        solution: Matrix.fromArray(["Cant Solve"]),
      })

    let y = new Matrix(new Vector(size.y, 1))
    for (let i = 0; i < size.y; i++) {
      let sum = 0
      for (let k = 0; k < i; k++) {
        sum += matrixes.U.get(k, i) * y.get(0, k)
      }
      let element = (x.get(0, i) - sum) / matrixes.U.get(i, i)
      y.set(0, i, element)
    }

    for (let i = size.y - 1; i >= 0; i--) {
      let sum = 0
      for (let k = i + 1; k < size.y; k++) {
        sum += matrixes.U.get(i, k) * x.get(0, k)
      }
      let element = +((y.get(0, i) - sum) / matrixes.U.get(i, i)).toFixed(3)
      x.set(0, i, element)
    }

    return mergeObject(matrixes, {
      solution: x.transpose(),
    })
  }
  has(value) {
    let size = this.getSize()
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        if (this.get(i, j) == value) return true
      }
    }
    return false
  }
  hasNaN() {
    let size = this.getSize()
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        if (isNaN(this.get(i, j))) return true
      }
    }
    return false
  }
}
