cognito-s3-sample
=================

Unauthenticated user can access to limited bucket or key on AWS S3, controled by AWS Cognito and IAM Role. (For example, Unauthenticated user can download only public file on specified S3 bucket, etc.)
AWS Cognito attaches unique IAM Role to Authenticated user and Unauthenticated user. We can attache different IAM Policy to their Role.

非認証ユーザでも、限定的にAWSリソースへの操作が可能になる。（例えば、指定したS3のbucketの公開ファイルだけをダウンロードできる、など）
AWS Cognitoは、認証(Authenticated)ユーザと、非認証(Unauthenticated)ユーザにそれぞれ別々のIAM Roleを割り当てる。それらのRoleに、別々のPolicyを割り当てることで、認可する対象を制御できる。

## Cognito Setting

- Create Identity Pool
  - ex.) betahikarucom_notfood_s3_upload
- Create Unauthenticated role
  - ex.) Cognito_betahikarucom_notfood_s3_uploadAuth_Role
- Create Authenticated role
  - ex.) Cognito_betahikarucom_notfood_s3_uploadUnauth_Role

## IAM Setting

- Attach policy for Unauthenticated role
  - s3:ListBucket : Allow to list files
  - s3:GetObject : Allow to download public files
  - example
```json

    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "uniqueID1",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::yourbucket/public/*"
            ]
        },
        {
            "Sid": "uniqueID2",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::yourbucket",
                "arn:aws:s3:::yourbucket/*"
            ]
        }
    ]
}
```

- TODO: Attach policy for Authenticated role
  - s3:ListBucket : Allow to list files
  - s3:GetObject : Allow to download files
  - s3:PutObject : Allow to upload files

## S3 Setting

- CORS Setting
  - Allow GET Method from any origin, because allow to list and download file from anywhere.
  - Allow PUT Method only from your-site, because don't allow to upload file from anywhere, but only your-site.
  - example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    <CORSRule>
        <AllowedOrigin>http://your-site.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

## Client (Browser, Javascript)

- Creating a new credentials object
```Javascript
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'your cognito IdentityPoolId',
});
```

- Gets the existing credentials
```Javascript
AWS.config.credentials.get(function(err) {
  if (!err) {
    console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
  }
});
```

## License
MIT License

Copyright (c) 2015, @betahikaru.
