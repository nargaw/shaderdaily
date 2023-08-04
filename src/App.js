import { BrowserRouter, Routes, Route } from 'react-router-dom'
//import { OrbitControls } from '@react-three/drei'
import Shader460 from './shaders/460/fragment.js'
import Shader461 from './shaders/461/fragment.js'
import Shader462 from './shaders/462/fragment.js'
import Shader463 from './shaders/463/fragment.js'
import Shader464 from './shaders/464/fragment.js'
import Shader465 from './shaders/465/fragment.js'
import Shader466 from './shaders/466/fragment.js'
import Shader467 from './shaders/467/fragment.js'
import Shader468 from './shaders/468/fragment.js'
import Shader469 from './shaders/469/fragment.js'
import Shader470 from './shaders/470/fragment.js'
import Shader471 from './shaders/471/fragment.js'
import Shader472 from './shaders/472/fragment.js'
import Shader473 from './shaders/473/fragment.js'
import Shader474 from './shaders/474/fragment.js'
import Shader475 from './shaders/475/fragment.js'
import Shader476 from './shaders/476/fragment.js'
import Shader477 from './shaders/477/fragment.js'
import Shader478 from './shaders/478/fragment.js'
import Shader479 from './shaders/479/fragment.js'
import Shader480 from './shaders/480/fragment.js'
import Shader481 from './shaders/481/fragment.js'
import Shader482 from './shaders/482/fragment.js'
import Shader483 from './shaders/483/fragment.js'
import Shader484 from './shaders/484/fragment.js'
import Shader485 from './shaders/485/fragment.js'
import Shader486 from './shaders/486/fragment.js'
import Shader487 from './shaders/487/fragment.js'
import Shader488 from './shaders/488/fragment.js'
import Shader489 from './shaders/489/fragment.js'
import Shader490 from './shaders/490/fragment.js'
import Shader491 from './shaders/491/fragment.js'
import Shader492 from './shaders/492/fragment.js'
import Shader493 from './shaders/493/fragment.js'
import Shader494 from './shaders/494/fragment.js'
import Shader495 from './shaders/495/fragment.js'
import Shader496 from './shaders/496/fragment.js'
import Shader497 from './shaders/497/fragment.js'
import Shader498 from './shaders/498/fragment.js'
import Shader499 from './shaders/499/fragment.js'
import Shader500 from './shaders/500/fragment.js'
import Shader501 from './shaders/501/fragment.js'
import Shader502 from './shaders/502/fragment.js'
import Shader503 from './shaders/503/fragment.js'
import Shader504 from './shaders/504/fragment.js'
import Shader505 from './shaders/505/fragment.js'
import Shader506 from './shaders/506/fragment.js'
import Shader507 from './shaders/507/fragment.js'
import Shader508 from './shaders/508/fragment.js'
import Shader509 from './shaders/509/fragment.js'
import Shader510 from './shaders/510/fragment.js'
import Shader511 from './shaders/511/fragment.js'
import Shader512 from './shaders/512/fragment.js'
import Shader513 from './shaders/513/fragment.js'
import Shader514 from './shaders/514/fragment.js'
import Shader515 from './shaders/515/fragment.js'
import Shader516 from './shaders/516/fragment.js'
import Shader517 from './shaders/517/fragment.js'
import Shader518 from './shaders/518/fragment.js'
import Shader519 from './shaders/519/fragment.js'
import Shader520 from './shaders/520/fragment.js'
import Shader521 from './shaders/521/fragment.js'
import Shader522 from './shaders/522/fragment.js'
import Shader523 from './shaders/523/fragment.js'
import Shader524 from './shaders/524/fragment.js'
import Shader525 from './shaders/525/fragment.js'
import Shader526 from './shaders/526/fragment.js'
import Shader527 from './shaders/527/fragment.js'
import Shader528 from './shaders/528/fragment.js'
import Shader529 from './shaders/529/fragment.js'
import Shader530 from './shaders/530/fragment.js'
import Shader531 from './shaders/531/fragment.js'
import Shader532 from './shaders/532/fragment.js'
import Shader533 from './shaders/533/fragment.js'
import Shader534 from './shaders/534/fragment.js'
import Shader535 from './shaders/535/fragment.js'
import Shader536 from './shaders/536/fragment.js'
import Shader537 from './shaders/537/fragment.js'
import Shader538 from './shaders/538/fragment.js'
import Shader539 from './shaders/539/fragment.js'
import Shader540 from './shaders/540/fragment.js'
import Shader541 from './shaders/541/fragment.js'
import Shader542 from './shaders/542/fragment.js'
import Shader543 from './shaders/543/fragment.js'
import Shader544 from './shaders/544/fragment.js'
import Shader545 from './shaders/545/fragment.js'
import Shader546 from './shaders/546/fragment.js'
import Shader547 from './shaders/547/fragment.js'
import Shader548 from './shaders/548/fragment.js'
import Shader549 from './shaders/549/fragment.js'
import Shader550 from './shaders/550/fragment.js'
import Shader551 from './shaders/551/fragment.js'
import Shader552 from './shaders/552/fragment.js'
import Shader553 from './shaders/553/fragment.js'
import Shader554 from './shaders/554/fragment.js'
import Shader555 from './shaders/555/fragment.js'
import Shader556 from './shaders/556/fragment.js'
import Shader557 from './shaders/557/fragment.js'
import Shader558 from './shaders/558/fragment.js'
import Shader559 from './shaders/559/fragment.js'
import Shader560 from './shaders/560/fragment.js'
import Shader561 from './shaders/561/fragment.js'
import Shader562 from './shaders/562/fragment.js'
import Shader563 from './shaders/563/fragment.js'
import Shader564 from './shaders/564/fragment.js'
import Shader565 from './shaders/565/fragment.js'
import Shader566 from './shaders/566/fragment.js'
import Shader567 from './shaders/567/fragment.js'
import Shader568 from './shaders/568/fragment.js'
import Shader569 from './shaders/569/fragment.js'
import Shader570 from './shaders/570/fragment.js'
import Shader571 from './shaders/571/fragment.js'
import Shader572 from './shaders/572/fragment.js'
import Shader573 from './shaders/573/fragment.js'
import Shader574 from './shaders/574/fragment.js'
import Shader575 from './shaders/575/fragment.js'
import Shader576 from './shaders/576/fragment.js'
import Shader577 from './shaders/577/fragment.js'
import Shader578 from './shaders/578/fragment.js'
import Shader579 from './shaders/579/fragment.js'
import Shader580 from './shaders/580/fragment.js'
import Shader581 from './shaders/581/fragment.js'
import Shader582 from './shaders/582/fragment.js'
import Shader583 from './shaders/583/fragment.js'
import Shader584 from './shaders/584/fragment.js'
import Shader585 from './shaders/585/fragment.js'
import Shader586 from './shaders/586/fragment.js'
import Shader587 from './shaders/587/fragment.js'
import Shader588 from './shaders/588/fragment.js'
import Shader589 from './shaders/589/fragment.js'
import Shader590 from './shaders/590/fragment.js'
import Shader591 from './shaders/591/fragment.js'
import Shader592 from './shaders/592/fragment.js'
import Shader593 from './shaders/593/fragment.js'
import Shader594 from './shaders/594/fragment.js'
import Shader595 from './shaders/595/fragment.js'
import Shader596 from './shaders/596/fragment.js'
import Shader597 from './shaders/597/fragment.js'
import Shader598 from './shaders/598/fragment.js'
import Shader599 from './shaders/599/fragment.js'
import Shader600 from './shaders/600/fragment.js'
import Shader601 from './shaders/601/fragment.js'

export default function App()
{

    const list = [
        <Shader460 />,
        <Shader461 />,
        <Shader462 />,
        <Shader463 />,
        <Shader464 />,
        <Shader465 />,
        <Shader466 />,
        <Shader467 />,
        <Shader468 />,
        <Shader469 />,
        <Shader470 />,
        <Shader471 />,
        <Shader472 />,
        <Shader473 />,
        <Shader474 />,
        <Shader475 />,
        <Shader476 />,
        <Shader477 />,
        <Shader478 />,
        <Shader479 />,
        <Shader480 />,
        <Shader481 />,
        <Shader482 />,
        <Shader483 />,
        <Shader484 />,
        <Shader485 />,
        <Shader486 />,
        <Shader487 />,
        <Shader488 />,
        <Shader489 />,
        <Shader490 />,
        <Shader491 />,
        <Shader492 />,
        <Shader493 />,
        <Shader494 />,
        <Shader495 />,
        <Shader496 />,
        <Shader497 />,
        <Shader498 />,
        <Shader499 />,
        <Shader500 />,
        <Shader501 />,
        <Shader502 />,
        <Shader503 />,
        <Shader504 />,
        <Shader505 />,
        <Shader506 />,
        <Shader507 />,
        <Shader508 />,
        <Shader509 />,
        <Shader510 />,
        <Shader511 />,
        <Shader512 />,
        <Shader513 />,
        <Shader514 />,
        <Shader515 />,
        <Shader516 />,
        <Shader517 />,
        <Shader518 />,
        <Shader519 />,
        <Shader520 />,
        <Shader521 />,
        <Shader522 />,
        <Shader523 />,
        <Shader524 />,
        <Shader525 />,
        <Shader526 />,
        <Shader527 />,
        <Shader528 />,
        <Shader529 />,
        <Shader530 />,
        <Shader531 />,
        <Shader532 />,
        <Shader533 />,
        <Shader534 />,
        <Shader535 />,
        <Shader536 />,
        <Shader537 />,
        <Shader538 />,
        <Shader539 />,
        <Shader540 />,
        <Shader541 />,
        <Shader542 />,
        <Shader543 />,
        <Shader544 />,
        <Shader545 />,
        <Shader546 />,
        <Shader547 />,
        <Shader548 />,
        <Shader549 />,
        <Shader550 />,
        <Shader551 />,
        <Shader552 />,
        <Shader553 />,
        <Shader554 />,
        <Shader555 />,
        <Shader556 />,
        <Shader557 />,
        <Shader558 />,
        <Shader559 />,
        <Shader560 />,
        <Shader561 />,
        <Shader562 />,
        <Shader563 />,
        <Shader564 />,
        <Shader565 />,
        <Shader566 />,
        <Shader567 />,
        <Shader568 />,
        <Shader569 />,
        <Shader570 />,
        <Shader571 />,
        <Shader572 />,
        <Shader573 />,
        <Shader574 />,
        <Shader575 />,
        <Shader576 />,
        <Shader577 />,
        <Shader578 />,
        <Shader579 />,
        <Shader580 />,
        <Shader581 />,
        <Shader582 />,
        <Shader583 />,
        <Shader584 />,
        <Shader585 />,
        <Shader586 />,
        <Shader587 />,
        <Shader588 />,
        <Shader589 />,
        <Shader590 />,
        <Shader591 />,
        <Shader592 />,
        <Shader593 />,
        <Shader594 />,
        <Shader595 />,
        <Shader596 />, 
        <Shader597 />,
        <Shader598 />,
        <Shader599 />,
        <Shader600 />,
        <Shader601 />
    ]

    return (
        <>
            {/* <OrbitControls /> */}
            <BrowserRouter>
                <Routes>
                    {/* <Route path='/'> */}
                        <Route index element={list[list.length - 1] } />
                        <Route path='460' element={<Shader460 />}/>
                        <Route path='461' element={<Shader461 />}/>
                        <Route path='462' element={<Shader462 />}/>
                        <Route path='463' element={<Shader463 />}/>
                        <Route path='464' element={<Shader464 />}/>
                        <Route path='465' element={<Shader465 />}/>
                        <Route path='466' element={<Shader466 />}/>
                        <Route path='467' element={<Shader467 />}/>
                        <Route path='468' element={<Shader468 />}/>
                        <Route path='469' element={<Shader469 />}/>
                        <Route path='470' element={<Shader470 />}/>
                        <Route path='471' element={<Shader471 />}/>
                        <Route path='472' element={<Shader472 />}/>
                        <Route path='473' element={<Shader473 />}/>
                        <Route path='474' element={<Shader474 />}/>
                        <Route path='475' element={<Shader475 />}/>
                        <Route path='476' element={<Shader476 />}/>
                        <Route path='477' element={<Shader477 />}/>
                        <Route path='478' element={<Shader478 />}/>
                        <Route path='479' element={<Shader479 />}/>
                        <Route path='480' element={<Shader480 />}/>
                        <Route path='481' element={<Shader481 />}/>
                        <Route path='482' element={<Shader482 />}/>
                        <Route path='483' element={<Shader483 />}/>
                        <Route path='484' element={<Shader484 />}/>
                        <Route path='485' element={<Shader485 />}/>
                        <Route path='486' element={<Shader486 />}/>
                        <Route path='487' element={<Shader487 />}/>
                        <Route path='488' element={<Shader488 />}/>
                        <Route path='489' element={<Shader489 />}/>
                        <Route path='490' element={<Shader490 />}/>
                        <Route path='491' element={<Shader491 />}/>
                        <Route path='492' element={<Shader492 />}/>
                        <Route path='493' element={<Shader493 />}/>
                        <Route path='494' element={<Shader494 />}/>
                        <Route path='495' element={<Shader495 />}/>
                        <Route path='496' element={<Shader496 />}/>
                        <Route path='497' element={<Shader497 />}/>
                        <Route path='498' element={<Shader498 />}/>
                        <Route path='499' element={<Shader499 />}/>
                        <Route path='500' element={<Shader500 />}/>
                        <Route path='501' element={<Shader501 />}/>
                        <Route path='502' element={<Shader502 />}/>
                        <Route path='503' element={<Shader503 />}/>
                        <Route path='504' element={<Shader504 />}/>
                        <Route path='505' element={<Shader505 />}/>
                        <Route path='506' element={<Shader506 />}/>
                        <Route path='507' element={<Shader507 />}/>
                        <Route path='508' element={<Shader508 />}/>
                        <Route path='509' element={<Shader509 />}/>
                        <Route path='510' element={<Shader520 />}/>
                        <Route path='511' element={<Shader521 />}/>
                        <Route path='512' element={<Shader522 />}/>
                        <Route path='513' element={<Shader523 />}/>
                        <Route path='514' element={<Shader524 />}/>
                        <Route path='515' element={<Shader525 />}/>
                        <Route path='516' element={<Shader526 />}/>
                        <Route path='517' element={<Shader527 />}/>
                        <Route path='518' element={<Shader528 />}/>
                        <Route path='519' element={<Shader529 />}/>
                        <Route path='520' element={<Shader520 />}/>
                        <Route path='521' element={<Shader521 />}/>
                        <Route path='522' element={<Shader522 />}/>
                        <Route path='523' element={<Shader523 />}/>
                        <Route path='524' element={<Shader524 />}/>
                        <Route path='525' element={<Shader525 />}/>
                        <Route path='526' element={<Shader526 />}/>
                        <Route path='527' element={<Shader527 />}/>
                        <Route path='528' element={<Shader528 />}/>
                        <Route path='529' element={<Shader529 />}/>
                        <Route path='530' element={<Shader530 />}/>
                        <Route path='531' element={<Shader531 />}/>
                        <Route path='532' element={<Shader532 />}/>
                        <Route path='533' element={<Shader533 />}/>
                        <Route path='534' element={<Shader534 />}/>
                        <Route path='535' element={<Shader535 />}/>
                        <Route path='536' element={<Shader536 />}/>
                        <Route path='537' element={<Shader537 />}/>
                        <Route path='538' element={<Shader538 />}/>
                        <Route path='539' element={<Shader539 />}/>
                        <Route path='540' element={<Shader540 />}/>
                        <Route path='541' element={<Shader541 />}/>
                        <Route path='542' element={<Shader542 />}/>
                        <Route path='543' element={<Shader543 />}/>
                        <Route path='544' element={<Shader544 />}/>
                        <Route path='545' element={<Shader545 />}/>
                        <Route path='546' element={<Shader546 />}/>
                        <Route path='547' element={<Shader547 />}/>
                        <Route path='548' element={<Shader548 />}/>
                        <Route path='549' element={<Shader549 />}/>
                        <Route path='550' element={<Shader550 />}/>
                        <Route path='551' element={<Shader551 />}/>
                        <Route path='552' element={<Shader552 />}/>
                        <Route path='553' element={<Shader553 />}/>
                        <Route path='554' element={<Shader554 />}/>
                        <Route path='555' element={<Shader555 />}/>
                        <Route path='556' element={<Shader556 />}/>
                        <Route path='557' element={<Shader557 />}/>
                        <Route path='558' element={<Shader558 />}/>
                        <Route path='559' element={<Shader559 />}/>
                        <Route path='560' element={<Shader560 />}/>
                        <Route path='561' element={<Shader561 />}/>
                        <Route path='562' element={<Shader562 />}/>
                        <Route path='563' element={<Shader563 />}/>
                        <Route path='564' element={<Shader564 />}/>
                        <Route path='565' element={<Shader565 />}/>
                        <Route path='566' element={<Shader566 />}/>
                        <Route path='567' element={<Shader567 />}/>
                        <Route path='568' element={<Shader568 />}/>
                        <Route path='569' element={<Shader569 />}/>
                        <Route path='570' element={<Shader570 />}/>
                        <Route path='571' element={<Shader571 />}/>
                        <Route path='572' element={<Shader572 />}/>
                        <Route path='573' element={<Shader573 />}/>
                        <Route path='574' element={<Shader574 />}/>
                        <Route path='575' element={<Shader575 />}/>
                        <Route path='576' element={<Shader576 />}/>
                        <Route path='577' element={<Shader577 />}/>
                        <Route path='578' element={<Shader578 />}/>
                        <Route path='579' element={<Shader579 />}/>
                        <Route path='580' element={<Shader580 />}/>
                        <Route path='581' element={<Shader581 />}/>
                        <Route path='582' element={<Shader582 />}/>
                        <Route path='583' element={<Shader583 />}/>
                        <Route path='584' element={<Shader584 />}/>
                        <Route path='585' element={<Shader585 />}/>
                        <Route path='586' element={<Shader586 />}/>
                        <Route path='587' element={<Shader587 />}/>
                        <Route path='588' element={<Shader588 />}/>
                        <Route path='589' element={<Shader589 />}/>
                        <Route path='590' element={<Shader590 />}/>
                        <Route path='591' element={<Shader591 />}/>
                        <Route path='592' element={<Shader592 />}/>
                        <Route path='593' element={<Shader593 />}/>
                        <Route path='594' element={<Shader594 />}/>
                        <Route path='595' element={<Shader595 />}/>
                        <Route path='596' element={<Shader596 />}/>
                        <Route path='597' element={<Shader597 />}/>
                        <Route path='598' element={<Shader598 />}/>
                        <Route path='599' element={<Shader599 />}/>
                        <Route path='600' element={<Shader600 />}/>
                        <Route path='601' element={<Shader601 />}/>
                    {/* </Route>  */}
                </Routes>
            </BrowserRouter>
        </>
    )
}