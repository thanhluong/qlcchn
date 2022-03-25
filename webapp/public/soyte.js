$("#btn-verify").click(function() {
	ownerName = $("#owner").val().trim();
	$.ajax({
		method: 'POST',
		url: '/api/verify',
		data: {
			owner: ownerName,
			degreeID: $("#degree").val().trim(),
			internID: $("#intern").val().trim()
		}
	}).done(function(msg) {
		console.log(msg);
		if (msg == 'valid') {
			$("#verificationTitle").text("✅ Thẩm định thành công");
			$("#verificationBody").text(`Hồ sơ của ${$("#owner").val().trim()} hoàn toàn hợp lệ!`);
		}
		else {
			$("#verificationTitle").text("💣 Thẩm định thất bại");
			$("#verificationBody").text(`Hồ sơ của ${ownerName} không hợp lệ!`);
		}
		$("#verifcationResultModal").modal('show');
	});
});