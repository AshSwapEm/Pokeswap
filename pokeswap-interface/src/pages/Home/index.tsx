import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import titleIcon_light from '../../assets/img/PokeSwap_Light-Character2.svg'
import titleIcon_dark from '../../assets/img/PokeSwap_Dark-Character2.svg'
// import TestNet from '../../components/TestNet'
// import leftIcon from '../../assets/img/PokeSwap_Ball - Harvest Icon.svg'
import { useDarkModeManager } from '../../state/user/hooks'
// import Modal from '../../components/Modal'
import {  getBallsTokenContract,getBallsRewardContract } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import logo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-LightVersion.svg'
import darkLogo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-DarkVersion.svg'
import useBlock from '../../hooks/useBlock'
import info_icon_dark from '../../assets/svg/Info-icon_Dark.svg'
import info_icon_white from '../../assets/svg/Info-icon_White.svg'
import { isMobile } from 'react-device-detect'


const CardBox = styled.div`
width:'690px';
    @media (max-width:480px){
        width:100%;
  }
`

const LeftBox = styled.div`
  margin-right: 50px;
  width: 350px;
  height: 140px;
  float: left;
  border-radius: 10px;
  background: ${({theme})=>theme.bg1};
  @media (max-width:480px){
    width:100%;
    margin-right:0;
    clear:both;
}
  
  `

const RightBox = styled.div`
    width: 350px;
    border-radius: 10px;
    height: 140px;
    float: left;
    background: ${({theme})=>theme.bg1};
    @media (max-width:480px){
        width:100%;
        margin-right:0;
        clear:both;
        margin-top:20px;
    }
`
const HeadImg = styled.img`
    width:13%;
    @media (max-width:480px){
        width:40%;
    }
`
// const ButtonStyle = styled.button`
// background: #f54439;
//     height: 50px;
//     border: 0;
//     color: white;
//     font-weight: 500;
//     border-radius: 25px;
//     font-size: 18px;
//     width: 190px;
//     outline:0;
//     cursor:pointer;
// `

const BoxBottom = styled.div`
width: 100%;
    font-size: 14px;
    color: #a2a0a0;
    padding: 0 15px 0 15px;
    height: 50px;
    line-height: 50px;
    border-top: 1px solid ${({theme})=>theme.border1};
`
const BoxBottomSpanLeft = styled.span`
display: inline-block;
`
const BoxBottomSpanRight = styled.span`
display: inline-block;
    text-align: right;
`

const LeftIconDiv = styled.div`
float: left;
padding: 20px 0 0 20px;
width: 30%;
`
const LeftIconContent = styled.div`
float: left;
width: 60%;
padding-top: 15px;
`
const LeftIconContens = styled.div`
font-size: 20px;
    background: ${({theme})=>theme.bg1};
    padding-bottom: 3px;
    font-weight: 600;
    color:#a2a0a0;
`

// const AvailibalS = styled.div`
// width: 100%;
// text-align: right;
// padding-right: 5%;
// color:#928e8e
// `
// const ContentS = styled.div`
// width: 90%;
//     border: 1px solid #d0cccc;
//     height: 40px;
//     margin-left: 5%;
//     margin-top: 5px;
//     margin-bottom: 10px;
// `
// const ButtonS1 = styled.button`
// border: 0;
// background: #dcd8d8;
// color: #151313;
// height: 36px;
// font-size: 18px;
// width: 100px;
// border-radius: 7px;
// outline:0;
//     cursor:pointer;
// `
// const ButtonS2 = styled.button`
// border: 0;
// background: #f9dada;
// color: #e23d5a;
// height: 36px;
// font-size: 18px;
// width: 100px;
// border-radius: 7px;
// margin-left: 20px;
// outline:0;
//     cursor:pointer;
// `
// const Content1Span = styled.span`
// font-size: 12px;
//     display: inline-block;
//     padding-right: 10px;
//     padding-left: 40px;
// `
// const Content2Span = styled.span`
// background: #f7db89;
//     display: inline-block;
//     padding: 5px;
//     color: #e8476b;
//     font-weight: bold;
// `

// const Input = styled.input`
// width:60%;
// height:38px;
// border:0;
// outline:none;
// background:${({theme})=>theme.bg2};
// color:${({theme})=>theme.text1};
// `

const Tipsty = styled.div`
  color: ${({theme})=>theme.text1};
    font-size: 14px;
    @media (max-width:480px){
      text-align:center;
    }
`
const ImagSty = styled.img`
    width:12px;
    margin-right: 5px;
`

export default function Home() {
    const { t } = useTranslation()
    const block = useBlock()
    const { account, chainId, library } = useActiveWeb3React()
    const [isDark] = useDarkModeManager()
    // const [showReward,SetShowReward] = useState(false)
    const [totalSupply,setTotalSupply] = useState('0');
    const [tokenBalance,setTokenBalance] = useState('0');
    const [txHash,setTxHash] = useState('');
    const [perBlockReward,setPerBlockReward] = useState('0')

    
    

    useEffect(()=>{
        getTokenTotalSupply()
        getTokenBalance()
        checkTxHash()
        getPerReward()
    },[block,account])
    function checkTxHash(){
        if(txHash.length>0){
          const timeInter = setInterval(()=>{
            if(!library) return;
            
              library.getTransactionReceipt(txHash).then((res)=>{
                console.log("resass--",res)
                if(res && res.status===1){
                    getTokenBalance()
                  setTxHash('')
                  console.log("update----")
                  clearInterval(timeInter)
                }
              })
          },1000)
        }
      }
    async function getTokenTotalSupply(){
        if (!chainId || !library || !account) return
        const ballsToken = getBallsTokenContract(chainId, library, account);
        let totalSupply = await ballsToken.totalSupply();
        console.log("totalSupply---",totalSupply);
        setTotalSupply(Number(totalSupply/10**18).toFixed(2))
    }
    async function getTokenBalance(){
        if (!chainId || !library || !account) return
        const ballsToken = getBallsTokenContract(chainId, library, account);
        let tokenBalance = await ballsToken.balanceOf(account);
        console.log("tokenBalance---",tokenBalance);
        setTokenBalance(Number(tokenBalance/10**18).toFixed(2))
    }
    async function getPerReward(){
      if (!chainId || !library || !account) return
      const ballsRewardContract = getBallsRewardContract(chainId, library, account);
      let reward = await ballsRewardContract.getNewBallsReward();
      setPerBlockReward(Number(reward/10**18).toFixed(2))
    }
  return (
    <>
    
    <div style={{marginTop:isMobile?"80px":"0px"}}>&nbsp;</div>
      <HeadImg  src={isDark?titleIcon_dark:titleIcon_light}/>
      <div style={{textAlign:'center'}}>
            <p style={{fontWeight:'bold',fontSize:'25px',margin:'20px 0 0 0'}}>Gotta swap em' all</p>
            <p style={{fontSize:'20px',marginTop:'15px'}}>
               {t('home_t1')}
            </p>
            {/* <p style={{fontSize:'18px',margin:'0px'}}>
                <img style={{width:'15%'}} src={isDark?darkLogo:logo}/>
            </p> */}
      </div>
      
      <CardBox style={{marginTop:'30px'}}>
          <LeftBox>
            <div style={{height:'90px'}}>
                <LeftIconDiv>
                    <img style={{width:'65%'}} src={isDark?darkLogo:logo}/>
                </LeftIconDiv>
                <LeftIconContent>
                  <LeftIconContens>{t('home_left')}</LeftIconContens>
                    <span style={{fontSize:'30px',fontWeight:'bold'}}>{tokenBalance}</span>
                </LeftIconContent>
                
            </div>
            <BoxBottom>
                <BoxBottomSpanLeft style={{width:'50%'}}>&nbsp;</BoxBottomSpanLeft>
                <BoxBottomSpanRight style={{width:'50%',textAlign:'right'}}>&nbsp;</BoxBottomSpanRight>
            </BoxBottom>
        </LeftBox>
        <RightBox>
            <div style={{height:'90px',paddingTop:'15px',paddingLeft:'35px'}}>
          <div style={{fontSize:'20px',fontWeight:'bold',color:'#9a9898'}}>{t('home_right1')}</div>
                <div style={{fontSize:'30px',fontWeight:'bold'}}>{totalSupply}</div>
            </div>
            
            <BoxBottom>
          <BoxBottomSpanLeft>{t('home_right2')}</BoxBottomSpanLeft>
                <BoxBottomSpanRight>&nbsp;&nbsp;&nbsp;{perBlockReward} BALLS</BoxBottomSpanRight>
            </BoxBottom>
        </RightBox>
      </CardBox>
      <Tipsty>
        <p>
          <ImagSty src={isDark?info_icon_white:info_icon_dark}/>
          <span>{t('home_tips1')}
          </span>
        </p>
        <p>
        <ImagSty src={isDark?info_icon_white:info_icon_dark}/>
          {t('home_tips2')}
        </p>
      </Tipsty>
      {/* <TestNet/> */}
      {/* <div style={{marginTop:'4px',marginBottom:isDark?"40px":"0px"}}>
          <ButtonStyle onClick={getReward}>Claim Rewards</ButtonStyle>
      </div> */}
      {/* <Modal isOpen={showReward}  onDismiss={() => SetShowReward(false)} maxHeight={100}>
            <div style={{width:'100%', textAlign:'center'}}>
              <h4>Claim BALLS Reward</h4>
              <AvailibalS>{pendingReward} <span style={{fontWeight:'bold'}}>BALLS</span> Availiable</AvailibalS>
              <ContentS>
                  <Input onChange={(e)=>onChangeInputReward(e)} value={inputReward}/>
                <Content1Span>BALLS</Content1Span>
                <Content2Span onClick={setInputRewardMax}>Max</Content2Span>
              </ContentS>
              <div style={{marginBottom:'20px'}}>
                <ButtonS1  onClick={() => SetShowReward(false)}>Cancel</ButtonS1>
                <ButtonS2 onClick={getReward}>Confirm</ButtonS2>
              </div>
            </div>
          </Modal> */}
    </>
  )
}
