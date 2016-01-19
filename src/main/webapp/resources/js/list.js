/**
 * Created by Administrator on 2016/1/19.
 */
$(function(){
    getDictList();//更新字典列表

    $(document.body).on('click','.addTemplate',function(e){
        $('#updateForm').html(template('templateTemp',{}));
        $('#templateModal').modal('show');
    });
    $(document.body).on('click','.editTemplate',function(e){
        var tar = e.currentTarget ;
        editTemplate(tar.dataset.id);
    });
    $(document.body).on('click','.saveTemplate',function(e){
        var tar= $(e.currentTarget).parents('form');
        saveTemplate(tar[0]);
    });
    $(document.body).on('click','.saveTemplate',function(e){
        var tar= $(e.currentTarget).parents('form');
        saveTemplate(tar[0]);
    });
    checkHash();
})

function getDictList(){
    $.get(ROOT + '/dict/list',function(data){
        if (data.code == 0) {
            $('#dictList').html(template('dictListTemp',{list:data.data}));
        }else {
            alert(data.msg);
        }
    },'json')
}

function editTemplate(id){
    $.get(ROOT + '/template/get?id='+id,function(data){
        console.debug(data);
        if (data.code == 0) {
            var DATA = data.data;
            var params = JSON.parse(DATA.params);

            console.debug(params);
            DATA.interval = params.interval || '';
            DATA.termsCountField = params.termsCountField || '';
            DATA.unit = params.unit || '';

            var form = $('#updateForm');
            form.html(template('templateTemp',DATA));

            var arr = ['terminals','channels','currentPages','prefixPages','events'] ;

            for (var n=arr.length-1 ; n>=0 ; n--) {
                if (params[arr[n]]){
                    var checkboxs = form.find('[name="'+arr[n]+'"]');
                    for(var i=params[arr[n]].length-1 ; i>=0 ;i--){
                        checkboxs.filter('[value="'+params[arr[n]][i]+'"]').attr('checked','checked');
                    }
                }
            }
                $('#templateModal').modal('show');

        }else {
            alert(data.msg);
        }
    },'json')
}

function saveTemplate(obj){//obj was a form

    var data = {};
    var	items = obj.elements;

    for ( var i=items.length-1 ; i>=0 ; i--) {
        var item = items[i];
        var value = item.value, name = item.name;
        if (!name || !value) {
            continue ;
        }
        if (data[name] !== undefined) {
            if (!data[name].push) {//如果不是数组则转化成数组
                data[name] = [data[name]];
            }
            data[name].push(value || '');
        } else if (item.type.toLowerCase() == 'checkbox' ) {
            if ( item.checked ){

                data[name] = [value] || [];
            }
        } else if (item.type.toLowerCase() == 'radiobox' ) {
            if ( item.checked ) {

                data[name] = value || '';
            }
        } else {
            data[name] = value || '';
        }
    }
    $.ajax({
        url:ROOT + "/template/update",
        data:"data="+JSON.stringify(data),
        type:'POST',
        error:function(e){
            alert(e);
        },
        success:function(){
            window.location.href = URI(location.href).hash('updatedFrom').toString();
            location.reload();
        }
    })
}

function checkHash(){
    switch (location.href.hash){
        case 'updatedFrom':
            layer.msg('模板保存成功!');
            break;
        default :
            break;
    }
    location.hash = '';
}