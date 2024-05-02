import React, { useRef, useState } from 'react';
import { Container, Label, Button, TextInput } from 'pcui';
import { getAssetPath } from '../helpers';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { File, SetProperty } from '../types';
import { useUser } from "@clerk/clerk-react";

const validUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const LoadControls = (props: { setProperty: SetProperty }) => {
    // const [link, setLink] = useState<string>("");
    const searchParams = new URLSearchParams(window.location.search);
    const { isSignedIn } = useUser();

    const [urlInputValid, setUrlInputValid] = useState(false);
    const inputFile = useRef(null);

    const onLoadButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    const onFileSelected = (event: React.ChangeEvent<any>) => {
        // `event` points to the selected file
        const viewer = (window as any).viewer;
        const files = event.target.files;
        if (viewer && files.length) {
            const loadList: Array<File> = [];
            for (let i = 0; i < files.length; ++i) {
                const file = files[i];
                loadList.push({
                    url: URL.createObjectURL(file),
                    filename: file.name
                });
            }
            viewer.loadFiles(loadList);
        }
    };
    // @typescript-eslint/no-unused-vars
    const onUrlSelected = () => {
        const viewer = (window as any).viewer;
        // @ts-ignore
        const value = document.getElementById('glb-url-input').ui.value;
        const url = new URL(value);
        const filename = url.pathname.split('/').pop();
        const hasExtension = !!filename.split('.').splice(1).pop();
        viewer.loadFiles([{
            url: value,
            filename: filename + (hasExtension ? '' : '.glb')
        }]);
    };

    const getQuizLink = () => {
        // prompt user to get a quiz link
        // eslint-disable-next-line no-alert
        const quizLink = prompt("Please enter the link to the quiz you would like to take: ");
        console.log(quizLink);
        // setLink(quizLink);
        // const googleFormRegex = /^https:\/\/forms\.gle\/[a-zA-Z0-9]+$/;
        console.log(searchParams);
        searchParams.set("quizlink", quizLink);


        const newPath = searchParams.toString();
        window.history.replaceState(null, '', `${window.location.pathname}?${newPath}`);
        // searchParams.set("quizlink", quizLink.toString());
        // if (googleFormRegex.test(quizLink)) {
        // } else {
        //     // eslint-disable-next-line no-alert
        //     alert("Please enter a valid Google Form link");
        // }
        // localStorage.removeItem("quizlink");
    };

    return (
        <div>
            <div id='load-controls'>
                {<Container class="load-button-panel" enabled flex>
                    <div className='header'>
                        <img src={getAssetPath('playcanvas-logo.png')}/>
                        <div>
                            <Label text='AR VIEWER' />
                        </div>
                    </div>
                    <input type='file' id='file' multiple onChange={onFileSelected} ref={inputFile} style={{ display: 'none' }} />
                    <div id="drag-drop" onClick={onLoadButtonClick}>
                        <Button id="drag-drop-search-icon" icon='E129' />
                        <Label class='desktop' text="Drag & drop your files or click to open files" />
                        <Label class='mobile' text="Click to open files" />
                    </div>
                    {/* <Label id='or-text' text="OR" class="centered-label" /> */}
                    {/* <TextInput class='secondary' id='glb-url-input' placeholder='enter url' keyChange onValidate={(value: string) => {
                        const isValid = validUrl(value);
                        setUrlInputValid(isValid);
                        return isValid;
                    }}/>
                    <Button class='secondary' id='glb-url-button' text='LOAD MODEL FROM URL' onClick={onUrlSelected} enabled={urlInputValid}></Button> */}
                    <div className="quiz-div">
                        <button className='quiz-button' id='' onClick={getQuizLink} >
                            {isSignedIn ? "START A QUIZ" : "SIGN IN TO START A QUIZ"}
                        </button>
                    </div>
                </Container>}
                <button className='login-button' id='' >
                    <header>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                </button>
            </div>
        </div>
    );
};

export default LoadControls;

// return (
//     <header>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </header>
//   )
