import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import'./styles/App.css'
import imageData from './data/imageDatas.json' // 获取图片相关的数据

// 利用自执行函数，将图片名信息转成图片URL路径信息
var imageDatas = (function getImageURL(imageDatasArr){
    for (var i = 0; i < imageDatasArr.length; i++) {
        let singleImageData = imageDatasArr[i]

        singleImageData.imageURL = require('./images/' + singleImageData.fileName)

        imageDatasArr[i] = singleImageData
    }
    return imageDatasArr
})(imageData)

/*
* 获取区间内的一个随机值
*/
function getRangeRandom(low,high){
    return Math.ceil(Math.random() * (high - low) + low)
}

/*
* 获取 0-30 之间的一个任意正负值
*/
function getDegRandom(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}

export default class App extends Component {
    Constant = {
        centerPos : {
            left:0,
            right:0
        },
        hPosRange:{             // 水平方向的取值范围
            leftSecX:[0,0],
            rightSecX:[0,0],
            y:[0,0]
        },
        vPosRange:{             // 垂直方向的取值范围
            x:[0,0],
            topY:[0,0]
        }
    };
    constructor(props){
        super(props)
        this.state = {
            imgsArrangeArr:[
                /*{
                    pos:{
                        left:'0',
                        top:'0'
                    },
                    rotate:'0',         // 旋转角度
                    isInverse:false,    // 图片正反面
                    isCenter:false,     // 图片是否居中
                }*/
            ]
        }
    }
    componentDidMount(){
        // 获取舞台大小
        var stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2)

        // 获取imgFigure大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2)

        // 计算中心图片位置点
        this.Constant.centerPos = {
            left:halfStageW - halfImgW,
            top:halfStageH - halfImgH
        }

        // 计算左侧右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = - halfImgW
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
        this.Constant.hPosRange.y[0] = -halfImgH
        this.Constant.hPosRange.y[1] = stageH - halfImgH

        // 计算上侧区域图片排布位置的取值位置
        this.Constant.vPosRange.topY[0] = -halfImgH
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
        this.Constant.vPosRange.x[0] = halfStageW - imgW
        this.Constant.vPosRange.x[1] = halfStageW

        this._rearrange(0)
    }
    /*
     * 翻转图片 
     * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数 
     */
    _inverse = (index) => {
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            })
        }.bind(this)
    }
    /*
     * 利用 rearrange函数，居中对应index的图片
     * @param index,需要被居中的图片对应的图片信息数组的index值
     * @return {Function}
     */
    _center = (index) => {
        return function(){
            this._rearrange(index)
        }.bind(this)
    }
    /*
     * 重新布局所有图片
     * @param centerIndex 指定剧中排布的图片
     */
    _rearrange = (centerIndex) => {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),       // 取一个或不取
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1)

            // 首先居中 centerIndex 的图片,居中的 centerIndex 的图片不需要旋转
            imgsArrangeCenterArr[0] = {
                pos : centerPos,
                rotate : 0,
                isCenter : true
            }
            // 居中的 centerIndex 的图片不需要旋转
            imgsArrangeCenterArr[0].rotate = 0


            // 取出要布局上侧的图片的状态信息
            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum)

            // 布局位于上侧的图片
            imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index] = {
                    pos: {
                        top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left:getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate: getDegRandom(),
                    isCenter:false
                }
            })

            // 布局左右两侧的图片
            for(var i = 0,j = imgsArrangeArr.length,k = j / 2; i<j;i++){
                var hPosRangeLORX = null

                // 前半部分布局左边，右半部分布局右边
                if(i < k){
                    hPosRangeLORX = hPosRangeLeftSecX
                }else{
                    hPosRangeLORX = hPosRangeRightSecX
                }

                imgsArrangeArr[i] = {
                    pos: {
                        top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left:getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: getDegRandom(),
                    isCenter: false
                }
            }

            //debugger;

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
            }

            imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            })

    }

    render() {
        var controllerUnits = [],
            imgFigures = []
        imageDatas.forEach(function(value,index){
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure key={index} ref={'imgFigure' + index} 
                                data={value} arrange={this.state.imgsArrangeArr[index]}
                                inverse={this._inverse(index)} center={this._center(index)}/>)
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                    inverse={this._inverse(index)} center={this._center(index)}/>)
        }.bind(this))


        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

// 控制组件
class ControllerUnit extends Component{
    _handleClick = (e) => {
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }
        e.stopPropagation()
        e.preventDefault()
    }
    render(){
        var imgFigureClassName = classNames('controller-unit',{
            'is-center':this.props.arrange.isCenter,
            'is-inverse':this.props.arrange.isCenter && this.props.arrange.isInverse
        })
        return (
            <span className={imgFigureClassName} onClick={this._handleClick}></span>
        )
    }
}

// 单个图片组件
class ImgFigure extends Component{
    _handleClick = (e) => {
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }
        e.stopPropagation()
        e.preventDefault()
    }
    render(){
        var styleObj = {}
        // 如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos
        }

        // 如果图片的旋转角度有值并且不为0，添加旋转角度
        if(this.props.arrange.rotate){
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)'
            }.bind(this))
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11
        }

        var imgFigureClassName = classNames('img-figure',{
            'is-inverse':this.props.arrange.isInverse
        })

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this._handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this._handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}