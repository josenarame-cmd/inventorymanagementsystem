async function test() {
    try {
        const loginRes = await fetch('http://localhost:8086/api/v1/auth/authenticate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: 'admin', password: 'password'}) // default password is often 'password' or 'admin123'
        });
        
        if (loginRes.status !== 200) {
           const log2 = await fetch('http://localhost:8086/api/v1/auth/authenticate', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({username: 'admin', password: 'admin123'})
           });
           if(log2.status === 200) {
               console.log("Logged in with admin123");
               await testWithToken(await log2.json());
           } else {
               console.log("LOGIN FAIL:", await log2.text());
           }
        } else {
           console.log("Logged in with password");
           await testWithToken(await loginRes.json());
        }
    } catch(err) {
        console.error("ERROR:", err);
    }
}

async function testWithToken(authData) {
    console.log("TOKEN RECVD:", authData.token);
    const usersRes = await fetch('http://localhost:8086/api/v1/users', {
        headers: { 'Authorization': 'Bearer ' + authData.token }
    });
    console.log("GET USERS STATUS:", usersRes.status);
    console.log("GET USERS BODY:", await usersRes.text());
}

test();
