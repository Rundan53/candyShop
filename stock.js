let Cname = document.getElementById('candyName');
let Cdesc = document.getElementById('description');
let Cprice = document.getElementById('price');
let Cquantity = document.getElementById('quantity');
let ul = document.getElementById('candies');
let addBtn = document.getElementById('add');

addBtn.addEventListener('click', addToCloud);



function addToCloud(e) {  //(Function to add data to crudCrud)
    e.preventDefault();
    let stock = {
        Name: Cname.value,
        Description: Cdesc.value,
        Price: Cprice.value,
        Quantity: Cquantity.value,
    }

    axios.post('https://crudcrud.com/api/1ef7cccf020346d7a5860ee2922e10c0/candyStock', stock)
        .then((res) => {
            addToScreen(res.data);
        })
        .catch((err) => {
            alert(err.message);
        });
}

function addToScreen(data) {  //(Function to add details to Screen)
    //All About Candies
    let li = document.createElement('li');
    let liText = document.createTextNode(`Name:${data.Name}, Description:${data.Description}, Price:${data.Price}, Quantity:${data.Quantity}`);
    li.appendChild(liText);
    ul.append(li);

    //Buy Buttons
    //buy1
    let buy1 = document.createElement('button');
    let buy1Name = document.createTextNode('BUY 1');
    buy1.className = 'btn btn-danger';
    buy1.appendChild(buy1Name);
    ul.append(buy1);

    //buy2
    let buy2 = document.createElement('button');
    let buy2Name = document.createTextNode('BUY 2');
    buy2.className = 'btn btn-success';
    buy2.appendChild(buy2Name);
    ul.append(buy2);

    //buy3
    let buy3 = document.createElement('button');
    let buy3Name = document.createTextNode('BUY 3');
    buy3.className = 'btn btn-danger';
    buy3.appendChild(buy3Name);
    ul.append(buy3);

    //eventListeners for buy btns
    buy1.addEventListener('click', (e) => update(e, data, 1));
    buy2.addEventListener('click', (e) => update(e, data, 2));
    buy3.addEventListener('click', (e) => update(e, data, 3));
}



async function update(event, data, buyQuan) {    //(Function to update data at crudCrud)

    //take updated object from the server to get latest stock's quantity evrytime
    event.preventDefault();
    let updatedRes = await axios.get(`https://crudcrud.com/api/1ef7cccf020346d7a5860ee2922e10c0/candyStock/${data._id}`);
    let updatedObj = updatedRes.data;

    if (buyQuan > updatedObj.Quantity && updatedObj.Quantity != 0) {
        alert(`You have only ${updatedObj.Quantity} left`);
        buyQuan = updatedObj.Quantity
    }


    if(updatedObj.Quantity==0){
        alert('NO STOCK')
        deleteFromCloud(updatedObj);
        location.reload();
    }
    else{
        axios.put(`https://crudcrud.com/api/1ef7cccf020346d7a5860ee2922e10c0/candyStock/${data._id}`, {
        Name: updatedObj.Name,
        Description: updatedObj.Description,
        Price: updatedObj.Price,
        Quantity: updatedObj.Quantity - buyQuan,
    })
        .then((res) => {
            location.reload();    //(refreshing page to get updated data on screen)
        })
        .catch((err) => {
            alert(err.message);
        })
    }
    
}


//(EL so that when refreshed, data from crudCrud will be on screen as it is)
window.addEventListener('DOMContentLoaded', () => {
    axios.get(`https://crudcrud.com/api/1ef7cccf020346d7a5860ee2922e10c0/candyStock`)
        .then((res) => {
            for (var i = 0; i < res.data.length; i++) {
                addToScreen(res.data[i]);
            }
        })
})



function deleteFromCloud(obj) {   //(Function to delete data from crudCrud)

    axios.delete(`https://crudcrud.com/api/1ef7cccf020346d7a5860ee2922e10c0/candyStock/${obj._id}`);
}