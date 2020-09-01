const express = require('express');
const router = express.Router();
// const multer = require('multer');
const ranhash = require('random-hash');
// const fs = require('fs');
// const path = require('path');
const Url = require('../models/url');
const urlexists = require('url-exists');
// const isurl = require('is-url');
const validurl = require('valid-url');


router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/:urlcode', (req, res, next) => {
    // URL Code가 파라미터로 들어올 때 원래 주소로 리다이렉트
    const urlcode = req.params.urlcode;

    Url.findOne({shortedUrlCode: urlcode}, (err, url) => {
        if (err) return res.status(500).send('저런! URL 찾는 데 문제가 발생했다고 하죠?');
        if (!url) return res.status(404).send('저런! 그런 URL은 이 세상에 없다고 하죠?');
        return res.status(302).redirect(url.originUrl);
    });
});

// urlExists('https://www.google.com', function(err, exists) {
//     console.log(exists); // true
// });

router.post('/generate', (req, res, next) => {
    // 원래 URL을 짧은 주소로 변환
    // if (req.body.keystring !== 'kysiks1031)!##') {
    //     return res.status(401).json({result: 401, message: '꺼ㅡ억!'});
    // }

    let originUrl = req.body.originurl;
    let urlCode = ranhash.generateHash();

    if (!originUrl) return res.status(400).send({result: 400, message: '저런! 줄이고 싶은 URL을 안 보냈죠?'});

    if (!originUrl.startsWith('http://') && !originUrl.startsWith('https://')) {
        urlexists('https://' + originUrl, (err, exists) => {
            if (exists) originUrl = 'https://' + originUrl;
            else originUrl = 'http://' + originUrl;

            if (!validurl.isWebUri(originUrl)) return res.status(400).send({result: 400, message: '저런! URL이 아닌 걸 줄이려고 했죠?'});

            // while (true) {
            //     Url.findOne({shortedUrlCode: urlCode}, (err, url) => {
            //         if (err) return res.status(500).send('저런! URL 중복검사하는데 문제가 생겼다고 하죠?');
            //         if (!url) break;
            //         urlCode = ranhash.generateHash();
            //     });
            // }

            Url.create({
                originUrl: originUrl,
                shortedUrlCode: urlCode
            }, (err, result) => {
                if (err) {
                    return res.status(500).send({result: 500, message: '저런! 단축URL 제작에 실패했다고 하죠?'});
                }
                res.status(200).json({result: 200, generatedUrl: "jum.pw/" + urlCode, message: "단축 URL 생성 성공. (AUTO)"});
            });
        });
    } else {
        if (!validurl.isWebUri(originUrl)) return res.status(400).send({result: 400, message: '저런! URL이 아닌 걸 줄이려고 했죠?'});

        Url.create({
            originUrl: originUrl,
            shortedUrlCode: urlCode
        }, (err, result) => {
            if (err) {
                return res.status(500).send({result: 500, message: '저런! 단축URL 제작에 실패했다고 하죠?'});
            }
            res.status(200).json({result: 200, generatedUrl: "jum.pw/" + urlCode, message: "단축 URL 생성 성공. (DIRECT)"});
        });
    }

});

module.exports = router;
